const express = require('express');
const router = express.Router();
const { getAllFacilities, getFacilityById, createFacility, updateFacility, deleteFacility } = require('../controllers/facilityController');
const { auth } = require('../middleware/auth');
const { isStaff } = require('../middleware/isStaff');

// Public routes
router.get('/', getAllFacilities);
router.get('/:id', getFacilityById);

// Protected staff routes
router.post('/', auth, isStaff, createFacility);
router.put('/:id', auth, isStaff, updateFacility);
router.delete('/:id', auth, isStaff, deleteFacility);

module.exports = router;