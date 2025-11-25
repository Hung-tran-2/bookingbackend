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
        const { status } = req.query;

        const where = {};
        if (status) {
            where.status = status;
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

        // If cancelled, update room status back to available
        if (status === 'cancelled') {
            const bookingRooms = await BookingRoom.findAll({
                where: { booking_id: id }
            });

            for (const br of bookingRooms) {
                await Room.update(
                    { status: 'available' },
                    { where: { room_id: br.room_id } }
                );
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

module.exports = {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBookingStatus,
    deleteBooking
};
