const { Room, RoomType, Booking } = require('../models');
const { successResponse, errorResponse, paginationResponse } = require('../utils/responseFormatter');
const { Op } = require('sequelize');

/**
 * Get all rooms with pagination
 */
const getAllRooms = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Room.findAndCountAll({
            limit,
            offset,
            include: [{
                model: RoomType,
                as: 'roomType',
                attributes: ['room_type_id', 'name', 'price', 'capacity']
            }],
            order: [['room_number', 'ASC']]
        });

        res.json(paginationResponse(rows, page, limit, count));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching rooms', error.message));
    }
};

/**
 * Get available rooms by date range
 */
const getAvailableRooms = async (req, res) => {
    try {
        const { checkin_date, checkout_date } = req.query;

        if (!checkin_date || !checkout_date) {
            return res.status(400).json(errorResponse('Checkin and checkout dates are required'));
        }

        // Find all rooms
        const allRooms = await Room.findAll({
            where: { status: 'available' },
            include: [{
                model: RoomType,
                as: 'roomType'
            }]
        });

        res.json(successResponse(allRooms));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching available rooms', error.message));
    }
};

/**
 * Get room by ID
 */
const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findByPk(id, {
            include: [{
                model: RoomType,
                as: 'roomType'
            }]
        });

        if (!room) {
            return res.status(404).json(errorResponse('Room not found'));
        }

        res.json(successResponse(room));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching room', error.message));
    }
};

/**
 * Create new room
 */
const createRoom = async (req, res) => {
    try {
        const { room_number, room_type_id, status, image } = req.body;

        if (!room_number || !room_type_id) {
            return res.status(400).json(errorResponse('Room number and room type are required'));
        }

        const room = await Room.create({
            room_number,
            room_type_id,
            status: status || 'available',
            image
        });

        res.status(201).json(successResponse(room, 'Room created successfully'));
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json(errorResponse('Room number already exists'));
        }
        res.status(500).json(errorResponse('Error creating room', error.message));
    }
};

/**
 * Update room
 */
const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { room_number, room_type_id, status, image } = req.body;

        const room = await Room.findByPk(id);
        if (!room) {
            return res.status(404).json(errorResponse('Room not found'));
        }

        await room.update({
            room_number: room_number || room.room_number,
            room_type_id: room_type_id || room.room_type_id,
            status: status || room.status,
            image: image !== undefined ? image : room.image
        });

        res.json(successResponse(room, 'Room updated successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error updating room', error.message));
    }
};

/**
 * Update room status
 */
const updateRoomStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['available', 'booked', 'maintenance'].includes(status)) {
            return res.status(400).json(errorResponse('Invalid status'));
        }

        const room = await Room.findByPk(id);
        if (!room) {
            return res.status(404).json(errorResponse('Room not found'));
        }

        await room.update({ status });
        res.json(successResponse(room, 'Room status updated successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error updating room status', error.message));
    }
};

/**
 * Delete room
 */
// Chỉ xóa những phòng trống chưa có đơn nào
const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;

        const room = await Room.findByPk(id);
        if (!room) {
            return res.status(404).json(errorResponse('Room not found'));
        }

        await room.destroy();
        res.json(successResponse(null, 'Room deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error deleting room', error.message));
    }
};

module.exports = {
    getAllRooms,
    getAvailableRooms,
    getRoomById,
    createRoom,
    updateRoom,
    updateRoomStatus,
    deleteRoom
};
