const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

/**
 * @swagger
 * /invoices/booking/{booking_id}:
 *   get:
 *     tags:
 *       - Invoices
 *     summary: Get invoice by booking ID
 *     description: Retrieve the invoice for a specific booking
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Invoice retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Invoice not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/booking/:booking_id', invoiceController.getInvoiceByBooking);

/**
 * @swagger
 * /invoices/generate/{booking_id}:
 *   post:
 *     tags:
 *       - Invoices
 *     summary: Generate invoice for booking
 *     description: Automatically generate an invoice for a booking, calculating room charges and service charges
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       201:
 *         description: Invoice generated successfully
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
 *                   example: Invoice generated successfully
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Invoice'
 *                     - type: object
 *                       properties:
 *                         booking:
 *                           $ref: '#/components/schemas/Booking'
 *                         payment:
 *                           $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Invoice already exists or validation error
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
router.post('/generate/:booking_id', invoiceController.generateInvoice);

/**
 * @swagger
 * /invoices/{id}:
 *   delete:
 *     tags:
 *       - Invoices
 *     summary: Delete invoice
 *     description: Delete an invoice from the system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Invoice ID
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
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
 *                   example: Invoice deleted successfully
 *       404:
 *         description: Invoice not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', invoiceController.deleteInvoice);

/**
 * @swagger
 * /invoices:
 *   get:
 *     tags:
 *       - Invoices
 *     summary: Get all invoices
 *     description: Retrieve a list of all invoices
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Invoice'
 */
router.get('/', invoiceController.getAllInvoices);

/**
 * @swagger
 * /invoices/{id}/status:
 *   put:
 *     tags:
 *       - Invoices
 *     summary: Update invoice status
 *     description: Update the status of an invoice (and its payment)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Invoice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [completed, failed]
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.put('/:id/status', invoiceController.updateInvoiceStatus);

module.exports = router;
