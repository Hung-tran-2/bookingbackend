const { RoomType } = require('../models');
const { successResponse, errorResponse, paginationResponse } = require('../utils/responseFormatter');

/**
 * Get all room types
 */
const getAllRoomTypes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await RoomType.findAndCountAll({
            limit,
            offset,
            order: [['room_type_id', 'ASC']]
        });

        res.json(paginationResponse(rows, page, limit, count));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching room types', error.message));
    }
};

/**
 * Get active room types only
 */
const getActiveRoomTypes = async (req, res) => {
    try {
        const roomTypes = await RoomType.findAll({
            where: { is_active: true },
            order: [['price', 'ASC']]
        });

        res.json(successResponse(roomTypes));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching active room types', error.message));
    }
};

/**
 * Get room type by ID
 */
const getRoomTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const roomType = await RoomType.findByPk(id, {
            include: [{
                association: 'rooms',
                attributes: ['room_id', 'room_number', 'status']
            }]
        });

        if (!roomType) {
            return res.status(404).json(errorResponse('Room type not found'));
        }

        res.json(successResponse(roomType));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching room type', error.message));
    }
};

/**
 * Create new room type
 */
const createRoomType = async (req, res) => {
    try {
        const { name, capacity, price, description, is_active } = req.body;

        // Validation
        if (!name || !capacity || !price) {
            return res.status(400).json(errorResponse('Name, capacity, and price are required'));
        }

        const roomType = await RoomType.create({
            name,
            capacity,
            price,
            description,
            is_active: is_active !== undefined ? is_active : true
        });

        res.status(201).json(successResponse(roomType, 'Room type created successfully'));
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json(errorResponse('Validation error', error.errors.map(e => e.message)));
        }
        res.status(500).json(errorResponse('Error creating room type', error.message));
    }
};

/**
 * Update room type
 */
const updateRoomType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, capacity, price, description, is_active } = req.body;

        const roomType = await RoomType.findByPk(id);
        if (!roomType) {
            return res.status(404).json(errorResponse('Room type not found'));
        }

        await roomType.update({
            name: name || roomType.name,
            capacity: capacity || roomType.capacity,
            price: price || roomType.price,
            description: description !== undefined ? description : roomType.description,
            is_active: is_active !== undefined ? is_active : roomType.is_active
        });

        res.json(successResponse(roomType, 'Room type updated successfully'));
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json(errorResponse('Validation error', error.errors.map(e => e.message)));
        }
        res.status(500).json(errorResponse('Error updating room type', error.message));
    }
};

/**
 * Delete room type
 */
const deleteRoomType = async (req, res) => {
    try {
        const { id } = req.params;

        const roomType = await RoomType.findByPk(id);
        if (!roomType) {
            return res.status(404).json(errorResponse('Room type not found'));
        }

        await roomType.destroy();
        res.json(successResponse(null, 'Room type deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error deleting room type', error.message));
    }
};

module.exports = {
    getAllRoomTypes,
    getActiveRoomTypes,
    getRoomTypeById,
    createRoomType,
    updateRoomType,
    deleteRoomType
};
