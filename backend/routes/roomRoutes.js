const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const upload = require('../middlewares/upload');

/**
 * @swagger
 * /rooms:
 *   get:
 *     tags:
 *       - Rooms
 *     summary: Get all rooms
 *     description: Retrieve a paginated list of all rooms with their room type information
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
 *     responses:
 *       200:
 *         description: List of rooms retrieved successfully
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
 *                     $ref: '#/components/schemas/Room'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', roomController.getAllRooms);

/**
 * @swagger
 * /rooms/available:
 *   get:
 *     tags:
 *       - Rooms
 *     summary: Get available rooms
 *     description: Get rooms available for booking within a specific date range
 *     parameters:
 *       - in: query
 *         name: checkin_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-12-01"
 *         description: Check-in date (YYYY-MM-DD)
 *       - in: query
 *         name: checkout_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-12-05"
 *         description: Check-out date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of available rooms
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
 *                     $ref: '#/components/schemas/Room'
 *       400:
 *         description: Missing or invalid date parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/available', roomController.getAvailableRooms);

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     tags:
 *       - Rooms
 *     summary: Get room by ID
 *     description: Retrieve a specific room by its ID with room type details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', roomController.getRoomById);

/**
 * @swagger
 * /rooms:
 *   post:
 *     tags:
 *       - Rooms
 *     summary: Create a new room
 *     description: Create a new room in the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room_number
 *               - room_type_id
 *             properties:
 *               room_number:
 *                 type: string
 *                 example: "101"
 *               room_type_id:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 enum: [available, occupied, maintenance, reserved]
 *                 default: available
 *               image:
 *                 type: string
 *                 example: "https://example.com/room.jpg"
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', upload.single('image'), roomController.createRoom);

/**
 * @swagger
 * /rooms/{id}:
 *   put:
 *     tags:
 *       - Rooms
 *     summary: Update room
 *     description: Update an existing room's information (with optional new image)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               room_number:
 *                 type: string
 *               room_type_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [available, booked, occupied, cleaning, maintenance]
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New room image file
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', upload.single('image'), roomController.updateRoom);

/**
 * @swagger
 * /rooms/{id}/status:
 *   patch:
 *     tags:
 *       - Rooms
 *     summary: Update room status
 *     description: Update only the status of a room
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
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
 *                 enum: [available, booked, occupied, cleaning, maintenance]
 *                 example: maintenance
 *     responses:
 *       200:
 *         description: Room status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id/status', roomController.updateRoomStatus);

/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     tags:
 *       - Rooms
 *     summary: Delete room
 *     description: Delete a room from the system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
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
 *                   example: Room deleted successfully
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', roomController.deleteRoom);

module.exports = router;
