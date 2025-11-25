const express = require('express');
const router = express.Router();
const roomTypeController = require('../controllers/roomTypeController');

// GET /api/room-types - Get all room types with pagination
router.get('/', roomTypeController.getAllRoomTypes);

// GET /api/room-types/active - Get active room types only
router.get('/active', roomTypeController.getActiveRoomTypes);

// GET /api/room-types/:id - Get room type by ID
router.get('/:id', roomTypeController.getRoomTypeById);

// POST /api/room-types - Create new room type
router.post('/', roomTypeController.createRoomType);

// PUT /api/room-types/:id - Update room type
router.put('/:id', roomTypeController.updateRoomType);

// DELETE /api/room-types/:id - Delete room type
router.delete('/:id', roomTypeController.deleteRoomType);

module.exports = router;
