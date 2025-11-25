const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// GET /api/services - Get all services
router.get('/', serviceController.getAllServices);

// GET /api/services/:id - Get service by ID
router.get('/:id', serviceController.getServiceById);

// POST /api/services - Create new service
router.post('/', serviceController.createService);

// PUT /api/services/:id - Update service
router.put('/:id', serviceController.updateService);

// DELETE /api/services/:id - Delete service
router.delete('/:id', serviceController.deleteService);

module.exports = router;
