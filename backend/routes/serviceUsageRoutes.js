const express = require('express');
const router = express.Router();
const serviceUsageController = require('../controllers/serviceUsageController');

/**
 * @swagger
 * /service-usage/{booking_id}/services:
 *   get:
 *     tags:
 *       - Service Usage
 *     summary: Get services for a booking
 *     description: Retrieve all services used for a specific booking
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: List of services for the booking
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
 *                     type: object
 *                     properties:
 *                       usage_id:
 *                         type: integer
 *                       booking_id:
 *                         type: integer
 *                       service_id:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *                       total_price:
 *                         type: number
 *                       service:
 *                         $ref: '#/components/schemas/Service'
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:booking_id/services', serviceUsageController.getBookingServices);

/**
 * @swagger
 * /service-usage/{booking_id}/services:
 *   post:
 *     tags:
 *       - Service Usage
 *     summary: Add service to booking
 *     description: Add a service to a booking with specified quantity
 *     parameters:
 *       - in: path
 *         name: booking_id
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
 *               - service_id
 *               - quantity
 *             properties:
 *               service_id:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Service added to booking successfully
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
 *                   example: Service added to booking successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     usage_id:
 *                       type: integer
 *                     booking_id:
 *                       type: integer
 *                     service_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     total_price:
 *                       type: number
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Booking or service not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:booking_id/services', serviceUsageController.addServiceToBooking);

/**
 * @swagger
 * /service-usage/{id}:
 *   delete:
 *     tags:
 *       - Service Usage
 *     summary: Delete service usage
 *     description: Remove a service from a booking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Service usage ID
 *     responses:
 *       200:
 *         description: Service usage deleted successfully
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
 *                   example: Service usage deleted successfully
 *       404:
 *         description: Service usage not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', serviceUsageController.deleteServiceUsage);

module.exports = router;
