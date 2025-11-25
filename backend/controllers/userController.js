const { User } = require('../models');
const { successResponse, errorResponse, paginationResponse } = require('../utils/responseFormatter');
const bcrypt = require('bcrypt');

/**
 * Get all users with pagination
 */
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            limit,
            offset,
            attributes: { exclude: ['password'] },
            order: [['created_at', 'DESC']]
        });

        res.json(paginationResponse(rows, page, limit, count));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching users', error.message));
    }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [{
                association: 'bookings',
                attributes: ['booking_id', 'checkin_date', 'checkout_date', 'status']
            }]
        });

        if (!user) {
            return res.status(404).json(errorResponse('User not found'));
        }

        res.json(successResponse(user));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching user', error.message));
    }
};

/**
 * Create new user
 */
const createUser = async (req, res) => {
    try {
        // Chỉ nhận 4 trường: full_name, email, password, phone
        const { full_name, email, password, phone } = req.body;

        if (!full_name) {
            return res.status(400).json(errorResponse('Full name is required'));
        }

        if (!email) {
            return res.status(400).json(errorResponse('Email is required'));
        }

        if (!password) {
            return res.status(400).json(errorResponse('Password is required'));
        }

        if (password.length < 6) {
            return res.status(400).json(errorResponse('Password must be at least 6 characters'));
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            full_name,
            email,
            password: hashedPassword,
            phone,
            id_card: null, // Set null để frontend có thể cập nhật sau
            role: 'user' // Mặc định role là user
        });

        const userResponse = { ...user.toJSON() };
        delete userResponse.password;

        res.status(201).json(successResponse(userResponse, 'User created successfully'));
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json(errorResponse('Validation error', error.errors.map(e => e.message)));
        }
        res.status(500).json(errorResponse('Error creating user', error.message));
    }
};

/**
 * Update user
 */
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, phone, email, id_card, password, role } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json(errorResponse('User not found'));
        }

        const updateData = {
            full_name: full_name || user.full_name,
            phone: phone !== undefined ? phone : user.phone,
            email: email !== undefined ? email : user.email,
            id_card: id_card !== undefined ? id_card : user.id_card,
            role: role || user.role
        };

        if (password) {
            if (password.length < 6) {
                return res.status(400).json(errorResponse('Password must be at least 6 characters'));
            }
            updateData.password = await bcrypt.hash(password, 10);
        }

        await user.update(updateData);

        const userResponse = { ...user.toJSON() };
        delete userResponse.password;

        res.json(successResponse(userResponse, 'User updated successfully'));
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json(errorResponse('Validation error', error.errors.map(e => e.message)));
        }
        res.status(500).json(errorResponse('Error updating user', error.message));
    }
};

/**
 * Delete user
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json(errorResponse('User not found'));
        }

        await user.destroy();
        res.json(successResponse(null, 'User deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error deleting user', error.message));
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
