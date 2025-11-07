const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Facility = require("../models/Facility");
const reminderService = require("../services/reminderService");
const smsService = require("../services/smsService");

const createAppointment = async (req, res) => {
  try {
    const { facilityId, service, scheduledAt, notes } = req.body;
    const patientId = req.user._id;

    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ error: "Facility not found" });
    }

    const appointment = new Appointment({
      patientId,
      facilityId,
      service,
      scheduledAt: new Date(scheduledAt),
      notes,
    });

    await appointment.save();

    if (req.user.consentSms) {
      await reminderService.scheduleReminders(
        appointment._id,
        req.user.phone,
        new Date(scheduledAt)
      );
    }

    const populated = await Appointment.findById(appointment._id)
      .populate("facilityId", "name address contactNumber")
      .populate("patientId", "name phone");

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate("facilityId", "name address contactNumber")
      .sort({ scheduledAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFacilityAppointments = async (req, res) => {
  try {
    const { facilityId } = req.params;

    if (
      req.user.role === "staff" &&
      req.user.facilityId.toString() !== facilityId
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const appointments = await Appointment.find({ facilityId })
      .populate("patientId", "name phone")
      .sort({ scheduledAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate("patientId", "name phone")
      .populate("facilityId", "name")
      .sort({ scheduledAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// New dedicated endpoint for staff dashboard with filtering
const getStaffAppointments = async (req, res) => {
  try {
    const { startDate, endDate, status, specialist, timeBlock } = req.query;

    // Build query object
    let query = {};

    // Date filtering - default to current day if no dates provided
    if (startDate && endDate) {
      query.scheduledAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      // Default to today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      query.scheduledAt = {
        $gte: today,
        $lt: tomorrow,
      };
    }

    // Status filtering
    if (status && status !== "all") {
      query.status = status;
    }

    // Service/Specialist filtering (using service field as specialist)
    if (specialist && specialist !== "all") {
      query.service = specialist;
    }

    // Fetch appointments with populated data
    let appointments = await Appointment.find(query)
      .populate("patientId", "name phone")
      .populate("facilityId", "name address")
      .sort({ scheduledAt: 1 });

    // Time block filtering (client-side for now, could be optimized)
    if (timeBlock && timeBlock !== "all") {
      appointments = appointments.filter((apt) => {
        const hour = new Date(apt.scheduledAt).getHours();
        if (timeBlock === "morning") return hour >= 6 && hour < 12;
        if (timeBlock === "afternoon") return hour >= 12 && hour < 17;
        if (timeBlock === "evening") return hour >= 17 && hour < 21;
        return true;
      });
    }

    // Transform data to match frontend expectations
    const transformedAppointments = appointments.map((apt) => ({
      _id: apt._id,
      date: apt.scheduledAt,
      patient: {
        _id: apt.patientId?._id,
        name: apt.patientId?.name || "Unknown",
        phone: apt.patientId?.phone || "N/A",
      },
      facility: {
        _id: apt.facilityId?._id,
        name: apt.facilityId?.name || "Unknown",
        address: apt.facilityId?.address,
      },
      specialist: apt.service || "General",
      status: apt.status,
      notes: apt.notes,
      createdAt: apt.createdAt,
      updatedAt: apt.updatedAt,
    }));

    res.json(transformedAppointments);
  } catch (error) {
    console.error("Error fetching staff appointments:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    const populated = await Appointment.findById(id)
      .populate("facilityId", "name")
      .populate("patientId", "name phone");

    res.json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const Reminder = require("../models/Reminder");

const sendTestSms = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("facilityId", "name")
      .populate("patientId", "name phone");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const message = `Test SMS: Hello ${
      appointment.patientId.name
    }, this is a test reminder for your appointment at ${
      appointment.facilityId.name
    } on ${appointment.scheduledAt.toLocaleString()}.`;

    const result = await smsService.sendSms(
      appointment.patientId.phone,
      message
    );

    // Persist an ad-hoc reminder record so providerMessageId can be tracked.
    // Use an atomic upsert (findOneAndUpdate with upsert) to avoid duplicate-key errors
    // if the same appointmentId+offset record already exists.
    try {
      const resObj = result && result.result;
      const messageId =
        resObj &&
        resObj.SMSMessageData &&
        resObj.SMSMessageData.Recipients &&
        resObj.SMSMessageData.Recipients[0] &&
        resObj.SMSMessageData.Recipients[0].messageId;

      const filter = { appointmentId: appointment._id, offset: "2h" };
      const update = {
        $set: {
          patientPhone: appointment.patientId.phone,
          scheduledSendAt: new Date(),
          sentAt: new Date(),
          status: "sent",
          providerResponse: result,
          providerMessageId: messageId,
        },
        $setOnInsert: {
          appointmentId: appointment._id,
          offset: "2h",
        },
      };

      await Reminder.findOneAndUpdate(filter, update, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
    } catch (e) {
      // If some other error occurs, log it. Duplicate key errors should be prevented by the upsert.
      console.warn("Failed to persist ad-hoc reminder:", e.message || e);
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAppointment,
  getPatientAppointments,
  getFacilityAppointments,
  getAllAppointments,
  getStaffAppointments,
  updateAppointmentStatus,
  sendTestSms,
};
