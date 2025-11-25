const { Invoice, Booking, Payment, BookingRoom, ServiceUsage } = require('../models');
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

module.exports = {
    getInvoiceByBooking,
    generateInvoice,
    deleteInvoice
};
