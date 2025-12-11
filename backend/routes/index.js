const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const roomTypeRoutes = require('./roomTypeRoutes');
const roomRoutes = require('./roomRoutes');
const bookingRoutes = require('./bookingRoutes');
const serviceRoutes = require('./serviceRoutes');
const serviceUsageRoutes = require('./serviceUsageRoutes');
const paymentRoutes = require('./paymentRoutes');
const invoiceRoutes = require('./invoiceRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/room-types', roomTypeRoutes);//http://localhost:5000/api/room-types
router.use('/rooms', roomRoutes);
router.use('/bookings', bookingRoutes);
router.use('/services', serviceRoutes);
router.use('/service-usage', serviceUsageRoutes);
router.use('/payments', paymentRoutes);
router.use('/invoices', invoiceRoutes);

// API info route
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Hotel Booking API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            roomTypes: '/api/room-types',
            rooms: '/api/rooms',
            bookings: '/api/bookings',
            services: '/api/services',
            payments: '/api/payments',
            invoices: '/api/invoices'
        }
    });
});

module.exports = router;
