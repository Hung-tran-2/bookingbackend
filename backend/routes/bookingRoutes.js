const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

/**
 * @swagger
 * /bookings:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get all bookings
 *     description: Retrieve a paginated list of all bookings with optional status filter
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, checked_in, checked_out]
 *         description: Filter by booking status
 *     responses:
 *       200:
 *         description: List of bookings retrieved successfully
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
 *                     $ref: '#/components/schemas/Booking'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', bookingController.getAllBookings);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get booking by ID
 *     description: Retrieve a specific booking with user and room details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', bookingController.getBookingById);

/**
 * @swagger
 * /bookings:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Create a new booking
 *     description: Create a new room booking with multiple rooms
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - checkin_date
 *               - checkout_date
 *               - rooms
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               checkin_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-01"
 *               checkout_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-05"
 *               source:
 *                 type: string
 *                 enum: [website, phone, walk_in]
 *                 default: website
 *                 example: website
 *               rooms:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - room_id
 *                     - price_per_night
 *                   properties:
 *                     room_id:
 *                       type: integer
 *                       example: 1
 *                     price_per_night:
 *                       type: number
 *                       example: 800000
 *     responses:
 *       201:
 *         description: Booking created successfully
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
 *                   example: Booking created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Validation error or room not available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', bookingController.createBooking);

/**
 * @swagger
 * /bookings/{id}/status:
 *   patch:
 *     tags:
 *       - Bookings
 *     summary: Update booking status
 *     description: Update the status of a booking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, checked_in, checked_out]
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Booking status updated successfully
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
 *                   example: Booking status updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/status', bookingController.updateBookingStatus);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     tags:
 *       - Bookings
 *     summary: Delete booking
 *     description: Delete a booking from the system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully
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
 *                   example: Booking deleted successfully
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
