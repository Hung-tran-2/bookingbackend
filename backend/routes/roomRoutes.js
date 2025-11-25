const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// GET /api/rooms - Get all rooms with pagination
router.get('/', roomController.getAllRooms);

// GET /api/rooms/available - Get available rooms by date
router.get('/available', roomController.getAvailableRooms);

// GET /api/rooms/:id - Get room by ID
router.get('/:id', roomController.getRoomById);

// POST /api/rooms - Create new room
router.post('/', roomController.createRoom);

// PUT /api/rooms/:id - Update room
router.put('/:id', roomController.updateRoom);

// PATCH /api/rooms/:id/status - Update room status
router.patch('/:id/status', roomController.updateRoomStatus);

// DELETE /api/rooms/:id - Delete room
router.delete('/:id', roomController.deleteRoom);

module.exports = router;
