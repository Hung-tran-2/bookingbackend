const { Payment, Booking } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * Get payments for a booking
 */
const getBookingPayments = async (req, res) => {
    try {
        const { booking_id } = req.params;

        const payments = await Payment.findAll({
            where: { booking_id },
            order: [['payment_time', 'DESC']]
        });

        res.json(successResponse(payments));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching payments', error.message));
    }
};

/**
 * Create payment
 */
const createPayment = async (req, res) => {
    try {
        const { booking_id, amount, method, transaction_code } = req.body;

        if (!booking_id || !amount) {
            return res.status(400).json(errorResponse('Booking ID and amount are required'));
        }

        // Check if booking exists
        const booking = await Booking.findByPk(booking_id);
        if (!booking) {
            return res.status(404).json(errorResponse('Booking not found'));
        }

        const payment = await Payment.create({
            booking_id,
            amount,
            method: method || 'cash',
            transaction_code,
            status: true
        });

        res.status(201).json(successResponse(payment, 'Payment created successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error creating payment', error.message));
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
                as: 'booking'
            }]
        });

        if (!payment) {
            return res.status(404).json(errorResponse('Payment not found'));
        }

        res.json(successResponse(payment));
    } catch (error) {
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
        res.status(500).json(errorResponse('Error deleting payment', error.message));
    }
};

module.exports = {
    getBookingPayments,
    createPayment,
    getPaymentById,
    deletePayment
};
