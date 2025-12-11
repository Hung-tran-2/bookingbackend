const { Payment, Booking, BookingRoom, ServiceUsage, Service, Room, RoomType, User } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { createVNPayUrl, verifyVNPaySignature } = require('../utils/vnpayHelper');

/**
 * Calculate total amount for a booking (room + services)
 */
const calculateBookingTotal = async (bookingId) => {
    const booking = await Booking.findByPk(bookingId, {
        include: [
            {
                model: BookingRoom,
                as: 'bookingRooms'
            }
        ]
    });

    if (!booking) {
        throw new Error('Booking not found');
    }

    // Calculate room total
    const checkin = new Date(booking.checkin_date);
    const checkout = new Date(booking.checkout_date);
    const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));

    const roomTotal = booking.bookingRooms?.reduce((sum, br) => {
        return sum + (parseFloat(br.price_per_night) * nights);
    }, 0) || 0;

    // Calculate service total from ServiceUsage
    const serviceUsages = await ServiceUsage.findAll({
        where: { booking_id: bookingId }
    });

    const serviceTotal = serviceUsages.reduce((sum, usage) => {
        return sum + parseFloat(usage.total_price || 0);
    }, 0);

    return {
        roomTotal,
        serviceTotal,
        total: roomTotal + serviceTotal,
        nights
    };
};

/**
 * Admin: Create cash payment
 */
const createPayment = async (req, res) => {
    try {
        const { booking_id, notes } = req.body;

        // Calculate total
        const { total } = await calculateBookingTotal(booking_id);

        // Create payment
        const payment = await Payment.create({
            booking_id,
            amount: total,
            payment_method: 'cash',
            status: 'completed',
            payment_date: new Date(),
            notes
        });

        // Update booking status to checked_out
        await Booking.update(
            { status: 'checked_out' },
            { where: { booking_id } }
        );

        res.status(201).json(successResponse(payment, 'Payment recorded successfully'));
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json(errorResponse('Error creating payment', error.message));
    }
};

/**
 * User: Create VNPay payment URL
 */
const createPaymentUrl = async (req, res) => {
    try {
        const { booking_id } = req.body;
        const user_id = req.user.user_id;

        // Verify booking belongs to user
        const booking = await Booking.findOne({
            where: { booking_id, user_id }
        });

        if (!booking) {
            return res.status(404).json(errorResponse('Booking not found'));
        }

        // Calculate total
        const { total, roomTotal, serviceTotal, nights } = await calculateBookingTotal(booking_id);

        console.log('=== Payment Calculation ===');
        console.log('Booking ID:', booking_id);
        console.log('Nights:', nights);
        console.log('Room Total:', roomTotal);
        console.log('Service Total:', serviceTotal);
        console.log('Grand Total:', total);
        console.log('=========================');

        // Validate amount
        const normalizedTotal = Math.round(Number(total));
        if (!Number.isFinite(normalizedTotal) || normalizedTotal <= 0) {
            return res.status(400).json(errorResponse('Invalid booking amount. Please check booking details.'));
        }

        // Create pending payment
        const payment = await Payment.create({
            booking_id,
            amount: normalizedTotal,
            payment_method: 'vnpay',
            status: 'pending'
        });

        const frontendBase = (process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');
        const clientIp = (req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || req.ip || '127.0.0.1');

        // Create VNPay URL
        console.log('Creating VNPay URL with params:', {
            amount: normalizedTotal,
            orderId: payment.payment_id,
            booking_id,
            frontend_url: frontendBase
        });

        const vnpayUrl = createVNPayUrl({
            amount: normalizedTotal,
            orderId: payment.payment_id,
            orderInfo: `Thanh toan don hang ${booking_id}`, // Tiếng Việt không dấu, không ký tự đặc biệt
            returnUrl: `${process.env.BACKEND_URL}/api/payments/vnpay-return`,
            ipAddr: clientIp
        });

        console.log('VNPay URL created successfully');
        console.log('Payment ID:', payment.payment_id);

        res.json(successResponse({ paymentUrl: vnpayUrl, payment_id: payment.payment_id }));
    } catch (error) {
        console.error('Error creating payment URL:', error);
        res.status(500).json(errorResponse('Error creating payment URL', error.message));
    }
};

/**
 * VNPay IPN (Instant Payment Notification) - Server to Server callback
 * This is where we UPDATE the database
 */
const vnpayIPN = async (req, res) => {
    try {
        console.log('=== VNPay IPN Callback ===');
        console.log('Query params:', req.query);

        const vnpParams = { ...req.query };

        // Verify signature
        const isValid = verifyVNPaySignature(vnpParams);
        if (!isValid) {
            console.error('Invalid signature in IPN');
            console.error('Received Params:', JSON.stringify(vnpParams, null, 2));
            return res.json({ RspCode: '97', Message: 'Invalid signature' });
        }

        const { vnp_ResponseCode, vnp_TxnRef, vnp_TransactionNo, vnp_Amount } = vnpParams;
        const paymentId = parseInt(vnp_TxnRef);

        console.log('Payment ID:', paymentId);
        console.log('Response Code:', vnp_ResponseCode);
        console.log('Transaction No:', vnp_TransactionNo);

        // Find payment
        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
            console.error('Payment not found:', paymentId);
            return res.json({ RspCode: '01', Message: 'Order not found' });
        }

        // Check if already processed
        if (payment.status === 'completed') {
            console.log('Payment already processed');
            return res.json({ RspCode: '02', Message: 'Order already confirmed' });
        }

        // Verify amount
        const expectedAmount = Math.round(parseFloat(payment.amount) * 100);
        const receivedAmount = parseInt(vnp_Amount);
        if (expectedAmount !== receivedAmount) {
            console.error('Amount mismatch. Expected:', expectedAmount, 'Received:', receivedAmount);
            return res.json({ RspCode: '04', Message: 'Invalid amount' });
        }

        if (vnp_ResponseCode === '00') {
            // Payment successful
            await payment.update({
                status: 'completed',
                payment_date: new Date(),
                transaction_id: vnp_TransactionNo
            });

            // Update booking status
            await Booking.update(
                { status: 'checked_out' },
                { where: { booking_id: payment.booking_id } }
            );

            console.log('Payment updated successfully');
            return res.json({ RspCode: '00', Message: 'success' });
        } else {
            // Payment failed
            await payment.update({ status: 'failed' });
            console.log('Payment marked as failed');
            return res.json({ RspCode: '00', Message: 'success' });
        }
    } catch (error) {
        console.error('Error processing VNPay IPN:', error);
        return res.json({ RspCode: '99', Message: 'Unknown error' });
    }
};

/**
 * VNPay Return URL - Browser redirect
 * This is ONLY for displaying results to the user
 * DO NOT update database here
 */
const vnpayReturn = async (req, res) => {
    try {
        console.log('=== VNPay Return URL ===');
        const vnpParams = { ...req.query };

        // Verify signature
        const isValid = verifyVNPaySignature(vnpParams);
        if (!isValid) {
            console.error('Invalid signature in Return URL');
            return res.redirect(`${process.env.FRONTEND_URL}/payment/result?code=97`);
        }

        const { vnp_ResponseCode, vnp_TxnRef, vnp_TransactionNo } = vnpParams;
        const paymentId = parseInt(vnp_TxnRef);

        if (vnp_ResponseCode === '00') {
            // Find payment
            const payment = await Payment.findByPk(paymentId);
            if (payment && payment.status !== 'completed') {
                // Update payment status
                await payment.update({
                    status: 'completed',
                    payment_date: new Date(),
                    transaction_id: vnp_TransactionNo
                });

                // Update booking status
                await Booking.update(
                    { status: 'confirmed' }, // Changed to 'confirmed' as 'checked_out' implies leaving hotel
                    { where: { booking_id: payment.booking_id } }
                );
                console.log('Payment updated via Return URL');
            }
        } else {
            // Handle failed payment if needed, though usually just redirect
            const payment = await Payment.findByPk(paymentId);
            if (payment && payment.status === 'pending') {
                await payment.update({ status: 'failed' });
            }
        }

        // Forward variable response code
        res.redirect(`${process.env.FRONTEND_URL}/payment/result?code=${vnp_ResponseCode}`);
    } catch (error) {
        console.error('Error processing VNPay return:', error);
        res.redirect(`${process.env.FRONTEND_URL}/payment/result?code=99`);
    }
};

/**
 * Get payments by booking
 */
const getPaymentsByBooking = async (req, res) => {
    try {
        const { booking_id } = req.params;

        const payments = await Payment.findAll({
            where: { booking_id },
            order: [['payment_date', 'DESC']]
        });

        res.json(successResponse(payments));
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json(errorResponse('Error fetching payments', error.message));
    }
};

/**
 * User: Get my payments
 */
const getMyPayments = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const payments = await Payment.findAll({
            include: [{
                model: Booking,
                as: 'booking',
                where: { user_id },
                include: [{
                    model: BookingRoom,
                    as: 'bookingRooms',
                    include: [{ model: Room, as: 'room' }]
                }]
            }],
            order: [['payment_date', 'DESC']]
        });

        res.json(successResponse(payments));
    } catch (error) {
        console.error('Error fetching my payments:', error);
        res.status(500).json(errorResponse('Error fetching payments', error.message));
    }
};

/**
 * Admin: Get all payments
 */
const getAllPayments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Payment.findAndCountAll({
            include: [{
                model: Booking,
                as: 'booking',
                include: [
                    {
                        model: BookingRoom,
                        as: 'bookingRooms',
                        include: [{ model: Room, as: 'room' }]
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['user_id', 'full_name', 'email', 'phone']
                    },
                    {
                        model: ServiceUsage,
                        as: 'serviceUsages'
                    }
                ]
            }],
            limit,
            offset,
            order: [['payment_date', 'DESC']]
        });

        // Calculate split totals for each payment
        const enrichedRows = rows.map(payment => {
            const booking = payment.booking;
            let roomTotal = 0;
            let serviceTotal = 0;

            if (booking) {
                // Calculate Room Total
                const checkin = new Date(booking.checkin_date);
                const checkout = new Date(booking.checkout_date);
                const nights = Math.max(1, Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24)));

                roomTotal = booking.bookingRooms?.reduce((sum, br) => {
                    return sum + (parseFloat(br.price_per_night) * nights);
                }, 0) || 0;

                // Calculate Service Total
                serviceTotal = booking.serviceUsages?.reduce((sum, usage) => {
                    return sum + parseFloat(usage.total_price || 0);
                }, 0) || 0;
            }

            const paymentJSON = payment.toJSON();
            // Return values for frontend columns: room_charge, service_charge, total_amount
            return {
                ...paymentJSON,
                room_charge: roomTotal,
                service_charge: serviceTotal,
                total_amount: payment.amount // Keep original total or recalculate: roomTotal + serviceTotal
            };
        });

        res.json({
            success: true,
            data: enrichedRows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching all payments:', error);
        res.status(500).json(errorResponse('Error fetching payments', error.message));
    }
};

/**
 * Get payment by ID
 */
const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;

        const payment = await Payment.findByPk(id, {
            include: [{
                model: Booking,
                as: 'booking',
                include: [{
                    model: BookingRoom,
                    as: 'bookingRooms',
                    include: [{ model: Room, as: 'room' }]
                }]
            }]
        });

        if (!payment) {
            return res.status(404).json(errorResponse('Payment not found'));
        }

        res.json(successResponse(payment));
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json(errorResponse('Error fetching payment', error.message));
    }
};


/**
 * Delete payment
 */
const deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByPk(id);

        if (!payment) {
            return res.status(404).json(errorResponse('Payment not found'));
        }

        await payment.destroy();
        res.json(successResponse(null, 'Payment deleted successfully'));
    } catch (error) {
        console.error('Error deleting payment:', error);
        res.status(500).json(errorResponse('Error deleting payment', error.message));
    }
};

module.exports = {
    createPayment,
    createPaymentUrl,
    vnpayIPN,
    vnpayReturn,
    getPaymentsByBooking,
    getMyPayments,
    getAllPayments,
    getPaymentById,
    deletePayment,
    calculateBookingTotal
};
