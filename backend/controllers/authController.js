  const { User } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Register new user
 */
const register = async (req, res) => {
    try {
        const { full_name, phone, email, password, role } = req.body;

        // Validation
        if (!full_name || !email || !password) {
            return res.status(400).json(errorResponse('Full name, email, and password are required'));
        }

        if (password.length < 6) {
            return res.status(400).json(errorResponse('Password must be at least 6 characters'));
        }

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json(errorResponse('Email already registered'));
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            full_name,
            phone,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        // Generate JWT token
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Return user without password
        const userResponse = {
            user_id: user.user_id,
            full_name: user.full_name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        };

        res.status(201).json(successResponse({
            user: userResponse,
            token
        }, 'User registered successfully'));

    } catch (error) {
        res.status(500).json(errorResponse('Error registering user', error.message));
    }
};

/**
 * Login user
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json(errorResponse('Email and password are required'));
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json(errorResponse('Invalid email or password'));
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json(errorResponse('Invalid email or password'));
        }

        // Generate JWT token
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Return user without password
        const userResponse = {
            user_id: user.user_id,
            full_name: user.full_name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        };

        res.json(successResponse({
            user: userResponse,
            token
        }, 'Login successful'));

    } catch (error) {
        res.status(500).json(errorResponse('Error logging in', error.message));
    }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.user_id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json(errorResponse('User not found'));
        }

        res.json(successResponse(user));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching profile', error.message));
    }
};

/**
 * Update current user profile
 */
const updateProfile = async (req, res) => {
    try {
        const { full_name, phone, email } = req.body;

        const user = await User.findByPk(req.user.user_id);
        if (!user) {
            return res.status(404).json(errorResponse('User not found'));
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json(errorResponse('Email already in use'));
            }
        }

        await user.update({
            full_name: full_name || user.full_name,
            phone: phone !== undefined ? phone : user.phone,
            email: email || user.email
        });

        const userResponse = { ...user.toJSON() };
        delete userResponse.password;

        res.json(successResponse(userResponse, 'Profile updated successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error updating profile', error.message));
    }
};

/**
 * Change password
 */
const changePassword = async (req, res) => {
    try {
        const { current_password, new_password } = req.body;

        if (!current_password || !new_password) {
            return res.status(400).json(errorResponse('Current password and new password are required'));
        }

        if (new_password.length < 6) {
            return res.status(400).json(errorResponse('New password must be at least 6 characters'));
        }

        const user = await User.findByPk(req.user.user_id);
        if (!user) {
            return res.status(404).json(errorResponse('User not found'));
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(current_password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json(errorResponse('Current password is incorrect'));
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(new_password, 10);
        await user.update({ password: hashedPassword });

        res.json(successResponse(null, 'Password changed successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error changing password', error.message));
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
};
