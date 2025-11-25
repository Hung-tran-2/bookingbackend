const express = require('express');
const router = express.Router();
const serviceUsageController = require('../controllers/serviceUsageController');

// GET /api/bookings/:booking_id/services - Get services for a booking
router.get('/:booking_id/services', serviceUsageController.getBookingServices);

// POST /api/bookings/:booking_id/services - Add service to booking
router.post('/:booking_id/services', serviceUsageController.addServiceToBooking);

// DELETE /api/service-usage/:id - Delete service usage
router.delete('/:id', serviceUsageController.deleteServiceUsage);

module.exports = router;
