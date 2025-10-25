const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { createAppointment, getPatientAppointments, getFacilityAppointments, updateAppointmentStatus, sendTestSms } = require('../controllers/appointmentController');

router.post('/', auth, createAppointment);
router.get('/', auth, getPatientAppointments);
router.get('/facility/:facilityId', auth, getFacilityAppointments);
router.patch('/:id', auth, updateAppointmentStatus);
router.post('/:id/send-test-sms', auth, sendTestSms);

module.exports = router;