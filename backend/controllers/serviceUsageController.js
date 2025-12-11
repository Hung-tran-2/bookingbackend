const { ServiceUsage, Service, Booking, BookingRoom, Room } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * Get all service usages with pagination (for admin)
 */
const getAllServiceUsages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await ServiceUsage.findAndCountAll({
            include: [
                {
                    model: Service,
                    as: 'service'
                },
                {
                    model: Booking,
                    as: 'booking',
                    include: [
                        {
                            model: BookingRoom,
                            as: 'bookingRooms',
                            include: [{
                                model: Room,
                                as: 'room'
                            }]
                        }
                    ]
                }
            ],
            order: [['usage_time', 'DESC']],
            limit,
            offset
        });

        res.json(successResponse(rows, 'Fetched service usages successfully', {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit)
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('Error fetching service usages', error.message));
    }
};

/**
 * Get services used in a booking
 */
const getBookingServices = async (req, res) => {
    try {
        const { booking_id } = req.params;

        const services = await ServiceUsage.findAll({
            where: { booking_id },
            include: [{
                model: Service,
                as: 'service'
            }],
            order: [['usage_time', 'DESC']]
        });

        res.json(successResponse(services));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching booking services', error.message));
    }
};

/**
 * Add service to booking
 */
const addServiceToBooking = async (req, res) => {
    try {
        const { booking_id } = req.params;
        const { service_id, quantity } = req.body;

        if (!service_id || !quantity) {
            return res.status(400).json(errorResponse('Service ID and quantity are required'));
        }

        // Check if booking exists
        const booking = await Booking.findByPk(booking_id);
        if (!booking) {
            return res.status(404).json(errorResponse('Booking not found'));
        }

        // Get service price
        const service = await Service.findByPk(service_id);
        if (!service) {
            return res.status(404).json(errorResponse('Service not found'));
        }

        const total_price = parseFloat(service.price) * quantity;

        const serviceUsage = await ServiceUsage.create({
            booking_id,
            service_id,
            quantity,
            total_price
        });

        // Fetch complete data
        const completeUsage = await ServiceUsage.findByPk(serviceUsage.usage_id, {
            include: [{
                model: Service,
                as: 'service'
            }]
        });

        res.status(201).json(successResponse(completeUsage, 'Service added to booking successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error adding service to booking', error.message));
    }
};

/**
 * Delete service usage
 */
const deleteServiceUsage = async (req, res) => {
    try {
        const { id } = req.params;

        const serviceUsage = await ServiceUsage.findByPk(id);
        if (!serviceUsage) {
            return res.status(404).json(errorResponse('Service usage not found'));
        }

        await serviceUsage.destroy();
        res.json(successResponse(null, 'Service usage deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error deleting service usage', error.message));
    }
};



/**
 * Update service usage
 */
const updateServiceUsage = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, service_id } = req.body;

        const serviceUsage = await ServiceUsage.findByPk(id);
        if (!serviceUsage) {
            return res.status(404).json(errorResponse('Service usage not found'));
        }

        // If updating service or quantity, recalculate price
        let newPrice = serviceUsage.total_price;
        let newServiceId = serviceUsage.service_id;
        let newQuantity = serviceUsage.quantity;

        if (service_id) newServiceId = service_id;
        if (quantity) newQuantity = quantity;

        if (service_id || quantity) {
            const service = await Service.findByPk(newServiceId);
            if (!service) {
                return res.status(404).json(errorResponse('Service not found'));
            }
            newPrice = parseFloat(service.price) * newQuantity;
        }

        await serviceUsage.update({
            service_id: newServiceId,
            quantity: newQuantity,
            total_price: newPrice
        });

        const updatedUsage = await ServiceUsage.findByPk(id, {
            include: [{ model: Service, as: 'service' }]
        });

        res.json(successResponse(updatedUsage, 'Service usage updated successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error updating service usage', error.message));
    }
};

/**
 * User request service (only for checked-in users)
 * Now requires booking_id in request body
 */
const requestServiceByUser = async (req, res) => {
    try {
        const { user_id } = req.user; // From auth middleware
        const { booking_id, service_id, quantity } = req.body;

        if (!booking_id || !service_id || !quantity) {
            return res.status(400).json(errorResponse('Booking ID, Service ID and quantity are required'));
        }

        // Verify this booking belongs to this user and is checked_in
        const booking = await Booking.findOne({
            where: {
                booking_id,
                user_id,
                status: 'checked_in'
            }
        });

        if (!booking) {
            return res.status(403).json(
                errorResponse('Booking không hợp lệ hoặc chưa check-in')
            );
        }

        // Get service and calculate price
        const service = await Service.findByPk(service_id);
        if (!service) {
            return res.status(404).json(errorResponse('Dịch vụ không tồn tại'));
        }

        const total_price = parseFloat(service.price) * quantity;

        // Create service usage
        const serviceUsage = await ServiceUsage.create({
            booking_id,
            service_id,
            quantity,
            total_price
        });

        const completeUsage = await ServiceUsage.findByPk(serviceUsage.usage_id, {
            include: [{ model: Service, as: 'service' }]
        });

        res.status(201).json(
            successResponse(completeUsage, 'Gọi dịch vụ thành công')
        );
    } catch (error) {
        res.status(500).json(errorResponse('Lỗi khi gọi dịch vụ', error.message));
    }
};

/**
 * Get service history for current user
 */
const getUserServiceHistory = async (req, res) => {
    try {
        const { user_id } = req.user;

        // Get all bookings for this user
        const bookings = await Booking.findAll({
            where: { user_id },
            attributes: ['booking_id']
        });

        const bookingIds = bookings.map(b => b.booking_id);

        const services = await ServiceUsage.findAll({
            where: { booking_id: bookingIds },
            include: [
                { model: Service, as: 'service' },
                { model: Booking, as: 'booking' }
            ],
            order: [['usage_time', 'DESC']]
        });

        res.json(successResponse(services));
    } catch (error) {
        res.status(500).json(errorResponse('Lỗi khi tải lịch sử', error.message));
    }
};

/**
 * Get current user's active bookings (all checked_in bookings)
 */
const getUserActiveBooking = async (req, res) => {
    try {
        const { user_id } = req.user;

        const activeBookings = await Booking.findAll({
            where: {
                user_id,
                status: 'checked_in'
            },
            include: [{
                model: require('../models').BookingRoom,
                as: 'bookingRooms',
                include: [{
                    model: require('../models').Room,
                    as: 'room'
                }]
            }],
            order: [['checkin_date', 'DESC']]
        });

        if (!activeBookings || activeBookings.length === 0) {
            return res.json(successResponse([], 'Không có booking đang hoạt động'));
        }

        res.json(successResponse(activeBookings));
    } catch (error) {
        res.status(500).json(errorResponse('Lỗi khi tải thông tin booking', error.message));
    }
};

module.exports = {
    getAllServiceUsages,
    getBookingServices,
    addServiceToBooking,
    deleteServiceUsage,
    requestServiceByUser,
    getUserServiceHistory,
    getUserActiveBooking,
    updateServiceUsage
};
