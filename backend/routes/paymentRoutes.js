const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// GET /api/payments/booking/:booking_id - Get payments for a booking
router.get('/booking/:booking_id', paymentController.getBookingPayments);

// GET /api/payments/:id - Get payment by ID
router.get('/:id', paymentController.getPaymentById);

// POST /api/payments - Create payment
router.post('/', paymentController.createPayment);

// DELETE /api/payments/:id - Delete payment
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
