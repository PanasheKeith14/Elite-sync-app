const express = require('express');
const router = express.Router();
const { getAllServices, getServiceById, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', protect, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;