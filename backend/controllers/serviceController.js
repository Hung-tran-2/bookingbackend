const { Service } = require('../models');
const { successResponse, errorResponse, paginationResponse } = require('../utils/responseFormatter');

/**
 * Get all services with pagination
 */
const getAllServices = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Service.findAndCountAll({
            limit,
            offset,
            order: [['service_id', 'ASC']]
        });

        res.json(paginationResponse(rows, page, limit, count));

    } catch (error) {
        res.status(500).json(errorResponse('Error fetching services', error.message));
    }
};

/**
 * Get service by ID
 */
const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id);

        if (!service) {
            return res.status(404).json(errorResponse('Service not found'));
        }

        res.json(successResponse(service));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching service', error.message));
    }
};


/**
 * Create new service
 */
const createService = async (req, res) => {
    try {
        const { name, price, unit } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json(errorResponse('Name and price are required'));
        }

        const service = await Service.create({ name, price, unit });

        res.status(201).json(successResponse(service, 'Service created successfully'));

    } catch (error) {
        res.status(500).json(errorResponse('Error creating service', error.message));
    }
};


/**
 * Update service
 */
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, unit } = req.body;

        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json(errorResponse('Service not found'));
        }

        await service.update({
            name: name ?? service.name,
            price: price ?? service.price,
            unit: unit ?? service.unit
        });

        res.json(successResponse(service, 'Service updated successfully'));

    } catch (error) {
        res.status(500).json(errorResponse('Error updating service', error.message));
    }
};


/**
 * Delete service
 */
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json(errorResponse('Service not found'));
        }

        await service.destroy();

        res.json(successResponse(null, 'Service deleted successfully'));

    } catch (error) {
        res.status(500).json(errorResponse('Error deleting service', error.message));
    }
};


module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};
