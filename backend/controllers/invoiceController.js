const { Invoice, Booking, Payment, BookingRoom, ServiceUsage, Room, User, Service } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * Get invoice by booking ID
 */
const getInvoiceByBooking = async (req, res) => {
    try {
        const { booking_id } = req.params;

        const invoice = await Invoice.findOne({
            where: { booking_id },
            include: [
                {
                    model: Booking,
                    as: 'booking'
                },
                {
                    model: Payment,
                    as: 'payment'
                }
            ]
        });

        if (!invoice) {
            return res.status(404).json(errorResponse('Invoice not found'));
        }

        res.json(successResponse(invoice));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching invoice', error.message));
    }
};

/**
 * Generate invoice for booking
 */
const generateInvoice = async (req, res) => {
    try {
        const { booking_id } = req.params;

        // Check if booking exists
        const booking = await Booking.findByPk(booking_id);
        if (!booking) {
            return res.status(404).json(errorResponse('Booking not found'));
        }

        // Check if invoice already exists
        const existingInvoice = await Invoice.findOne({ where: { booking_id } });
        if (existingInvoice) {
            return res.status(400).json(errorResponse('Invoice already exists for this booking'));
        }

        // Calculate room charges
        const bookingRooms = await BookingRoom.findAll({
            where: { booking_id }
        });

        const checkin = new Date(booking.checkin_date);
        const checkout = new Date(booking.checkout_date);
        const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));

        let room_charge = 0;
        for (const br of bookingRooms) {
            room_charge += parseFloat(br.price_per_night) * nights;
        }

        // Calculate service charges
        const serviceUsages = await ServiceUsage.findAll({
            where: { booking_id }
        });

        let service_charge = 0;
        for (const su of serviceUsages) {
            service_charge += parseFloat(su.total_price);
        }

        // Get payment (use first payment or create placeholder)
        let payment = await Payment.findOne({
            where: { booking_id }
        });

        if (!payment) {
            // Create a placeholder payment
            payment = await Payment.create({
                booking_id,
                amount: room_charge + service_charge,
                method: 'cash',
                status: false
            });
        }

        // Create invoice
        const invoice = await Invoice.create({
            booking_id,
            payment_id: payment.payment_id,
            room_charge,
            service_charge
        });

        // Fetch complete invoice
        const completeInvoice = await Invoice.findByPk(invoice.invoice_id, {
            include: [
                { model: Booking, as: 'booking' },
                { model: Payment, as: 'payment' }
            ]
        });

        res.status(201).json(successResponse(completeInvoice, 'Invoice generated successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error generating invoice', error.message));
    }
};

/**
 * Delete invoice
 */
const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findByPk(id);
        if (!invoice) {
            return res.status(404).json(errorResponse('Invoice not found'));
        }

        await invoice.destroy();
        res.json(successResponse(null, 'Invoice deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error deleting invoice', error.message));
    }
};

/**
 * Get all invoices with pagination
 */
const getAllInvoices = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Query Payment table directly since Invoice table might be empty
        const { count, rows } = await Payment.findAndCountAll({
            include: [
                {
                    model: Booking,
                    as: 'booking',
                    include: [
                        { model: User, as: 'user', attributes: ['user_id', 'full_name', 'email', 'phone'] },
                        {
                            model: BookingRoom,
                            as: 'bookingRooms',
                            include: [{ model: Room, as: 'room' }]
                        },
                        {
                            model: ServiceUsage,
                            as: 'serviceUsages',
                            include: [{ model: Service, as: 'service' }]
                        }
                    ]
                }
            ],
            limit,
            offset,
            order: [['payment_date', 'DESC']]
        });

        // Map Payment data to look like Invoice data for frontend compatibility
        const mappedRows = rows.map(payment => {
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

            return {
                invoice_id: payment.payment_id, // Virtual Invoice ID
                booking_id: payment.booking_id,

                // Calculated fields
                room_charge: roomTotal,
                service_charge: serviceTotal,
                total_amount: payment.amount,

                created_at: payment.payment_date,
                payment: payment, // Nest payment so frontend structure payment.status works
                booking: payment.booking,

                // Virtual fields if needed
                status: payment.status
            };
        });

        res.json({
            success: true,
            data: mappedRows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json(errorResponse('Error fetching invoices', error.message));
    }
};

/**
 * Update invoice status (updates underlying Payment)
 */
const updateInvoiceStatus = async (req, res) => {
    try {
        const { id } = req.params; // payment_id
        const { status } = req.body; // 'completed' or 'failed'

        const payment = await Payment.findByPk(id, {
            include: [
                { model: Booking, as: 'booking' }
            ]
        });

        if (!payment) {
            return res.status(404).json(errorResponse('Payment not found'));
        }

        // Update Payment status
        await payment.update({
            status: status === 'completed' ? 'completed' : 'failed',
            payment_date: status === 'completed' ? new Date() : payment.payment_date
        });

        // If completed, update Booking status
        if (status === 'completed' && payment.booking) {
            await payment.booking.update({ status: 'confirmed' });
        }

        // Return updated "invoice" structure
        const updatedPayment = await Payment.findByPk(id, {
            include: [
                { model: Booking, as: 'booking', include: [{ model: User, as: 'user' }] },
            ]
        });

        const mappedInvoice = {
            invoice_id: updatedPayment.payment_id,
            booking_id: updatedPayment.booking_id,
            total_amount: updatedPayment.amount,
            created_at: updatedPayment.payment_date,
            payment: updatedPayment,
            booking: updatedPayment.booking,
            status: updatedPayment.status
        };

        res.json(successResponse(mappedInvoice, 'Invoice status updated successfully'));
    } catch (error) {
        console.error('Error updating invoice status:', error);
        res.status(500).json(errorResponse('Error updating invoice status', error.message));
    }
};

module.exports = {
    getInvoiceByBooking,
    generateInvoice,
    deleteInvoice,
    getAllInvoices,
    updateInvoiceStatus
};
