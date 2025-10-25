const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Facility = require('../models/Facility');
const reminderService = require('../services/reminderService');
const smsService = require('../services/smsService');

const createAppointment = async (req, res) => {
  try {
    const { facilityId, service, scheduledAt, notes } = req.body;
    const patientId = req.user._id;

    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    const appointment = new Appointment({
      patientId,
      facilityId,
      service,
      scheduledAt: new Date(scheduledAt),
      notes
    });

    await appointment.save();

    if (req.user.consentSms) {
      await reminderService.scheduleReminders(appointment._id, req.user.phone, new Date(scheduledAt));
    }

    const populated = await Appointment.findById(appointment._id)
      .populate('facilityId', 'name address contactNumber')
      .populate('patientId', 'name phone');

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate('facilityId', 'name address contactNumber')
      .sort({ scheduledAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFacilityAppointments = async (req, res) => {
  try {
    const { facilityId } = req.params;

    if (req.user.role === 'staff' && req.user.facilityId.toString() !== facilityId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const appointments = await Appointment.find({ facilityId })
      .populate('patientId', 'name phone')
      .sort({ scheduledAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    const populated = await Appointment.findById(id)
      .populate('facilityId', 'name')
      .populate('patientId', 'name phone');

    res.json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sendTestSms = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate('facilityId', 'name')
      .populate('patientId', 'name phone');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const message = `Test SMS: Hello ${appointment.patientId.name}, this is a test reminder for your appointment at ${appointment.facilityId.name} on ${appointment.scheduledAt.toLocaleString()}.`;

    const result = await smsService.sendSms(appointment.patientId.phone, message);

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAppointment,
  getPatientAppointments,
  getFacilityAppointments,
  updateAppointmentStatus,
  sendTestSms
};