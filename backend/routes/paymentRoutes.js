// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

/**
 * ✅ LẤY DANH SÁCH PAYMENT (có phân trang)
 * GET /payments?page=&limit=
 */
router.get('/', paymentController.getAllPayments);

/**
 * ✅ THỐNG KÊ THANH TOÁN THEO NĂM (THÁNG + QUÝ)
 * GET /payments/stats?year=2025
 */
router.get('/stats', paymentController.getPaymentStats);

/**
 * ✅ LẤY PAYMENT THEO BOOKING
 * GET /payments/booking/:booking_id
 */
router.get('/booking/:booking_id', paymentController.getBookingPayments);

/**
 * ✅ LẤY PAYMENT THEO ID
 * GET /payments/:id
 */
router.get('/:id', paymentController.getPaymentById);

/**
 * ✅ TẠO PAYMENT
 * POST /payments
 */
router.post('/', paymentController.createPayment);

/**
 * ✅ XÓA PAYMENT
 * DELETE /payments/:id
 */
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
