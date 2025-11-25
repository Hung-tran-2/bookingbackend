const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

/**
 * @swagger
 * /payments/booking/{booking_id}:
 *   get:
 *     tags:
 *       - Payments
 *     summary: Get payments for a booking
 *     description: Retrieve all payments made for a specific booking
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: List of payments for the booking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/booking/:booking_id', paymentController.getBookingPayments);

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     tags:
 *       - Payments
 *     summary: Get payment by ID
 *     description: Retrieve a specific payment by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', paymentController.getPaymentById);

/**
 * @swagger
 * /payments:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Create a payment
 *     description: Create a new payment for a booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - booking_id
 *               - amount
 *               - method
 *             properties:
 *               booking_id:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: number
 *                 example: 3200000
 *               method:
 *                 type: string
 *                 enum: [cash, momo, vnpay]
 *                 example: momo
 *               transaction_code:
 *                 type: string
 *                 example: MOMO123456
 *                 description: Optional transaction code from payment gateway
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Payment created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', paymentController.createPayment);

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     tags:
 *       - Payments
 *     summary: Delete payment
 *     description: Delete a payment record from the system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Payment deleted successfully
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
