const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseFormatter');

/**
 * Verify JWT token middleware
 */
const verifyToken = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json(errorResponse('Access denied. No token provided'));
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add user info to request
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json(errorResponse('Token expired'));
        }
        return res.status(403).json(errorResponse('Invalid token'));
    }
};

/**
 * Check if user has required role
 */
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json(errorResponse('Unauthorized'));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json(errorResponse('Access denied. Insufficient permissions'));
        }

        next();
    };
};

/**
 * Optional auth - adds user info if token exists but doesn't require it
 */
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }

        next();
    } catch (error) {
        // Continue without user info
        next();
    }
};

module.exports = {
    verifyToken,
    checkRole,
    optionalAuth
};
