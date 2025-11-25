const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// GET /api/bookings - Get all bookings with pagination
router.get('/', bookingController.getAllBookings);

// GET /api/bookings/:id - Get booking by ID
router.get('/:id', bookingController.getBookingById);

// POST /api/bookings - Create new booking
router.post('/', bookingController.createBooking);

// PATCH /api/bookings/:id/status - Update booking status
router.patch('/:id/status', bookingController.updateBookingStatus);

// DELETE /api/bookings/:id - Delete booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
