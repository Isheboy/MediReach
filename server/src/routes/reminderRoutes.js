const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Reminder = require('../models/Reminder');

router.get('/', auth, async (req, res) => {
  try {
    const { facilityId, status, limit = 50 } = req.query;
    let query = {};
    if (status) query.status = status;
    if (req.user.role === 'patient') {
      query.patientPhone = req.user.phone;
    }

    const reminders = await Reminder.find(query).populate({ path: 'appointmentId', populate: [{ path: 'patientId', select: 'name phone' }, { path: 'facilityId', select: 'name' }] }).sort({ scheduledSendAt: -1 }).limit(parseInt(limit));

    let filteredReminders = reminders;
    if (facilityId && req.user.role === 'staff') {
      filteredReminders = reminders.filter(r => r.appointmentId?.facilityId?._id.toString() === facilityId);
    }
    res.json(filteredReminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;