const express = require('express');
const router = express.Router();
const serviceUsageController = require('../controllers/serviceUsageController');

/**
 * @swagger
 * /service-usage/:
 *   get:
 *     tags:
 *       - Service Usage
 *     summary: Get all service usages (admin)
 *     description: Retrieve all service usages with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of all service usages
 */
router.get('/', serviceUsageController.getAllServiceUsages);

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


router.put('/:id', serviceUsageController.updateServiceUsage);

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

// User-facing endpoints (require authentication)
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * /service-usage/request:
 *   post:
 *     tags:
 *       - Service Usage
 *     summary: User request service (checked-in users only)
 *     description: Allow checked-in users to request hotel services
 *     security:
 *       - bearerAuth: []
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
 *         description: Service requested successfully
 *       403:
 *         description: User not checked-in
 *       404:
 *         description: Service not found
 */
router.post('/request', verifyToken, serviceUsageController.requestServiceByUser);

/**
 * @swagger
 * /service-usage/my-history:
 *   get:
 *     tags:
 *       - Service Usage
 *     summary: Get user's service history
 *     description: Retrieve all services requested by the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Service history retrieved successfully
 */
router.get('/my-history', verifyToken, serviceUsageController.getUserServiceHistory);

/**
 * @swagger
 * /service-usage/my-booking:
 *   get:
 *     tags:
 *       - Service Usage
 *     summary: Get user's active booking
 *     description: Get current user's checked-in booking information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active booking information
 */
router.get('/my-booking', verifyToken, serviceUsageController.getUserActiveBooking);

module.exports = router;
