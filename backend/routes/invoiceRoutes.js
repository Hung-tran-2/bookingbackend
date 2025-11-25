const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// GET /api/invoices/booking/:booking_id - Get invoice by booking ID
router.get('/booking/:booking_id', invoiceController.getInvoiceByBooking);

// POST /api/invoices/generate/:booking_id - Generate invoice for booking
router.post('/generate/:booking_id', invoiceController.generateInvoice);

// DELETE /api/invoices/:id - Delete invoice
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;
