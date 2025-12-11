const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Admin routes - require admin role
router.post('/', verifyToken, checkRole('admin'), paymentController.createPayment);
router.get('/', verifyToken, checkRole('admin', 'user'), paymentController.getAllPayments);

// User routes - require authentication
router.post('/create-url', verifyToken, paymentController.createPaymentUrl);
router.get('/my-payments', verifyToken, paymentController.getMyPayments);

// VNPay callbacks - no auth required (called by VNPay)
router.get('/vnpay-ipn', paymentController.vnpayIPN);  // Server-to-server callback
router.get('/vnpay-return', paymentController.vnpayReturn);  // Browser redirect

// Common routes - require authentication
router.get('/booking/:booking_id', verifyToken, paymentController.getPaymentsByBooking);
router.get('/:id', verifyToken, paymentController.getPaymentById);
router.delete('/:id', verifyToken, checkRole('admin'), paymentController.deletePayment);

module.exports = router;
