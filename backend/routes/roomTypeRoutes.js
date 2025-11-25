const express = require('express');
const router = express.Router();
const roomTypeController = require('../controllers/roomTypeController');

/**
 * @swagger
 * /room-types:
 *   get:
 *     tags:
 *       - Room Types
 *     summary: Get all room types
 *     description: Retrieve a paginated list of all room types
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
 *         description: List of room types retrieved successfully
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
 *                     $ref: '#/components/schemas/RoomType'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', roomTypeController.getAllRoomTypes);

/**
 * @swagger
 * /room-types/active:
 *   get:
 *     tags:
 *       - Room Types
 *     summary: Get active room types
 *     description: Retrieve only active room types (is_active = true)
 *     responses:
 *       200:
 *         description: List of active room types
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
 *                     $ref: '#/components/schemas/RoomType'
 */
router.get('/active', roomTypeController.getActiveRoomTypes);

/**
 * @swagger
 * /room-types/{id}:
 *   get:
 *     tags:
 *       - Room Types
 *     summary: Get room type by ID
 *     description: Retrieve a specific room type by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room type ID
 *     responses:
 *       200:
 *         description: Room type retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/RoomType'
 *       404:
 *         description: Room type not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', roomTypeController.getRoomTypeById);

/**
 * @swagger
 * /room-types:
 *   post:
 *     tags:
 *       - Room Types
 *     summary: Create a new room type
 *     description: Create a new room type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - capacity
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Phòng Deluxe
 *               capacity:
 *                 type: integer
 *                 example: 2
 *               price:
 *                 type: number
 *                 example: 800000
 *               description:
 *                 type: string
 *                 example: Phòng cao cấp 2 người
 *               is_active:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Room type created successfully
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
router.post('/', roomTypeController.createRoomType);

/**
 * @swagger
 * /room-types/{id}:
 *   put:
 *     tags:
 *       - Room Types
 *     summary: Update room type
 *     description: Update an existing room type
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Room type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Room type not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', roomTypeController.updateRoomType);

/**
 * @swagger
 * /room-types/{id}:
 *   delete:
 *     tags:
 *       - Room Types
 *     summary: Delete room type
 *     description: Delete a room type from the system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room type ID
 *     responses:
 *       200:
 *         description: Room type deleted successfully
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
 *                   example: Room type deleted successfully
 *       404:
 *         description: Room type not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', roomTypeController.deleteRoomType);

module.exports = router;
