const { Booking, User, Room, BookingRoom, RoomType } = require('../models');
const { successResponse, errorResponse, paginationResponse } = require('../utils/responseFormatter');

/**
 * Get all bookings with pagination
 */
const getAllBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { status, checkin_date, checkout_date } = req.query;

        const where = {};
        if (status) {
            where.status = status;
        }
        if (checkin_date) {
            where.checkin_date = checkin_date;
        }
        if (checkout_date) {
            where.checkout_date = checkout_date;
        }

        const { count, rows } = await Booking.findAndCountAll({
            where,
            limit,
            offset,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['user_id', 'full_name', 'phone', 'email']
                },
                {
                    model: Room,
                    as: 'rooms',
                    through: { attributes: ['price_per_night'] },
                    include: [{
                        model: RoomType,
                        as: 'roomType',
                        attributes: ['name']
                    }]
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(paginationResponse(rows, page, limit, count));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching bookings', error.message));
    }
};

/**
 * Get booking by ID
 */
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user'
                },
                {
                    model: Room,
                    as: 'rooms',
                    through: { attributes: ['price_per_night'] },
                    include: [{
                        model: RoomType,
                        as: 'roomType'
                    }]
                }
            ]
        });

        if (!booking) {
            return res.status(404).json(errorResponse('Booking not found'));
        }

        res.json(successResponse(booking));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching booking', error.message));
    }
};

/**
 * Create new booking
 */
const createBooking = async (req, res) => {
    try {
        const { user_id, checkin_date, checkout_date, rooms, source } = req.body;

        if (!user_id || !checkin_date || !checkout_date || !rooms || rooms.length === 0) {
            return res.status(400).json(errorResponse('User, dates, and rooms are required'));
        }

        // Create booking
        const booking = await Booking.create({
            user_id,
            checkin_date,
            checkout_date,
            source,
            status: 'pending'
        });

        // Create booking rooms
        for (const roomData of rooms) {
            await BookingRoom.create({
                booking_id: booking.booking_id,
                room_id: roomData.room_id,
                price_per_night: roomData.price_per_night
            });

            // Update room status
            await Room.update(
                { status: 'booked' },
                { where: { room_id: roomData.room_id } }
            );
        }

        // Fetch complete booking data
        const completeBooking = await Booking.findByPk(booking.booking_id, {
            include: [
                { model: User, as: 'user' },
                { model: Room, as: 'rooms', through: { attributes: ['price_per_night'] } }
            ]
        });

        res.status(201).json(successResponse(completeBooking, 'Booking created successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error creating booking', error.message));
    }
};

/**
 * Update booking status
 */
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json(errorResponse('Invalid status'));
        }

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json(errorResponse('Booking not found'));
        }

        await booking.update({ status });

        // If cancelled or checked_out, check if room can be set to available
        if (status === 'cancelled' || status === 'checked_out') {
            const { Op } = require('sequelize');
            const bookingRooms = await BookingRoom.findAll({
                where: { booking_id: id }
            });

            for (const br of bookingRooms) {
                // Check if there are any other active bookings for this room
                const now = new Date();
                const otherActiveBookings = await Booking.findAll({
                    where: {
                        booking_id: { [Op.ne]: id }, // Exclude current booking
                        status: { [Op.in]: ['pending', 'confirmed', 'checked_in'] }
                    },
                    include: [{
                        model: BookingRoom,
                        as: 'bookingRooms',
                        where: { room_id: br.room_id },
                        required: true
                    }]
                });

                // Only set room to available if no other active bookings exist
                if (otherActiveBookings.length === 0) {
                    await Room.update(
                        { status: 'available' },
                        { where: { room_id: br.room_id } }
                    );
                    console.log(`Room ${br.room_id} set to available (no other active bookings)`);
                } else {
                    console.log(`Room ${br.room_id} kept as booked (${otherActiveBookings.length} other active bookings exist)`);
                }
            }
        }

        res.json(successResponse(booking, 'Booking status updated successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error updating booking status', error.message));
    }
};

/**
 * Delete booking
 */
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json(errorResponse('Booking not found'));
        }

        await booking.destroy();
        res.json(successResponse(null, 'Booking deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error deleting booking', error.message));
    }
};

/**
 * Get bookings by user ID
 */
const getBookingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Fetching bookings for user:', userId);

        const { Service, ServiceUsage, BookingRoom, Payment } = require('../models');

        const bookings = await Booking.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Room,
                    as: 'rooms',
                    through: { attributes: ['price_per_night'] },
                    include: [{
                        model: RoomType,
                        as: 'roomType',
                        attributes: ['name']
                    }]
                },
                {
                    model: BookingRoom,
                    as: 'bookingRooms',
                    attributes: ['booking_id', 'room_id', 'price_per_night']
                },
                {
                    model: Service,
                    as: 'services',
                    through: {
                        attributes: ['quantity', 'total_price', 'usage_time']
                    }
                },
                {
                    model: Payment,
                    as: 'payments',
                    attributes: ['payment_id', 'amount', 'status', 'payment_method', 'created_at']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        // Debug logging
        console.log(`Found ${bookings.length} bookings for user ${userId}`);
        if (bookings.length > 0) {
            console.log('First booking data:');
            console.log('- Booking ID:', bookings[0].booking_id);
            console.log('- Rooms count:', bookings[0].rooms?.length);
            console.log('- BookingRooms count:', bookings[0].bookingRooms?.length);
            console.log('- BookingRooms data:', JSON.stringify(bookings[0].bookingRooms, null, 2));
        }

        res.json(successResponse(bookings));
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json(errorResponse('Error fetching user bookings', error.message));
    }
};

module.exports = {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBookingStatus,
    deleteBooking,
    getBookingsByUser
};
