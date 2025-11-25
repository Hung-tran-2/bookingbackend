const { ServiceUsage, Service, Booking } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

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

module.exports = {
    getBookingServices,
    addServiceToBooking,
    deleteServiceUsage
};
