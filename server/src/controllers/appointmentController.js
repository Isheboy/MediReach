const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Facility = require("../models/Facility");
const reminderService = require("../services/reminderService");
const smsService = require("../services/smsService");
const notificationService = require("../services/notificationService");

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
      .populate("staffId", "name role")
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

    // Date filtering - only filter if dates are explicitly provided
    if (startDate && endDate) {
      query.scheduledAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    // If no date filter provided, show ALL appointments (don't default to today)

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
      .populate("staffId", "name role")
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
      staff: apt.staffId
        ? {
            _id: apt.staffId._id,
            name: apt.staffId.name,
            role: apt.staffId.role,
          }
        : null,
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
    const { status, staffId } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    appointment.status = status;

    // Assign staff when accepting/confirming pending appointment
    if (staffId && appointment.status === "pending" && status === "confirmed") {
      appointment.staffId = staffId;
    }

    await appointment.save();

    const populated = await Appointment.findById(id)
      .populate("facilityId", "name")
      .populate("patientId", "name phone")
      .populate("staffId", "name role");

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

// ============= NEW WORKFLOW FUNCTIONS =============

/**
 * Helper: Check availability for a time slot
 * Validates that the requested time doesn't conflict with existing confirmed appointments
 */
const checkAvailability = async (
  facilityId,
  scheduledAt,
  excludeAppointmentId = null
) => {
  try {
    const requestedTime = new Date(scheduledAt);

    // Define a time window (e.g., 30 minutes before and after)
    const timeWindow = 30 * 60 * 1000; // 30 minutes in milliseconds
    const windowStart = new Date(requestedTime.getTime() - timeWindow);
    const windowEnd = new Date(requestedTime.getTime() + timeWindow);

    // Find conflicting appointments
    const query = {
      facilityId,
      scheduledAt: {
        $gte: windowStart,
        $lte: windowEnd,
      },
      status: {
        $in: [
          "confirmed",
          "pending",
          "reschedule_pending_patient",
          "pending_staff_review",
        ],
      },
    };

    // Exclude current appointment if rescheduling
    if (excludeAppointmentId) {
      query._id = { $ne: excludeAppointmentId };
    }

    const conflicts = await Appointment.find(query);

    return {
      available: conflicts.length === 0,
      conflicts: conflicts.length,
      conflictingAppointments: conflicts,
    };
  } catch (error) {
    console.error("Error checking availability:", error);
    return {
      available: false,
      error: error.message,
    };
  }
};

/**
 * Staff confirms a pending appointment
 * POST /api/appointments/:id/confirm
 */
const confirmAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const staffId = req.user._id;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Only pending appointments can be confirmed
    if (appointment.status !== "pending") {
      return res.status(400).json({
        error: `Cannot confirm appointment with status: ${appointment.status}`,
      });
    }

    // Update appointment
    appointment.status = "confirmed";
    appointment.staffId = staffId;
    await appointment.save();

    // Send notification to patient
    await notificationService.sendConfirmationNotification(id, "confirmed");

    // Populate and return
    const populated = await Appointment.findById(id)
      .populate("facilityId", "name address")
      .populate("patientId", "name phone")
      .populate("staffId", "name role");

    res.json({
      success: true,
      appointment: populated,
      message: "Appointment confirmed successfully",
    });
  } catch (error) {
    console.error("Error confirming appointment:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Staff proposes a reschedule (initiates reschedule from staff side)
 * POST /api/appointments/:id/reschedule/staff
 */
const staffProposeReschedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { newTime, reason } = req.body;
    const staffId = req.user._id;

    if (!newTime) {
      return res.status(400).json({ error: "New time is required" });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check availability for new time
    const availability = await checkAvailability(
      appointment.facilityId,
      newTime,
      id
    );

    if (!availability.available) {
      return res.status(409).json({
        error: "Requested time slot is not available",
        conflicts: availability.conflicts,
      });
    }

    // Add to reschedule history
    appointment.rescheduleHistory.push({
      requestedBy: "staff",
      requestedById: staffId,
      originalTime: appointment.scheduledAt,
      proposedTime: new Date(newTime),
      reason: reason || "Time management/slot optimization",
      status: "pending",
    });

    // Update status
    appointment.status = "reschedule_pending_patient";
    await appointment.save();

    // Notify patient
    await notificationService.sendRescheduleRequest(id, newTime, "staff");

    const populated = await Appointment.findById(id)
      .populate("facilityId", "name")
      .populate("patientId", "name phone")
      .populate("staffId", "name");

    res.json({
      success: true,
      appointment: populated,
      message: "Reschedule proposal sent to patient",
    });
  } catch (error) {
    console.error("Error proposing reschedule:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Patient requests a reschedule
 * POST /api/appointments/:id/reschedule/patient
 */
const patientRequestReschedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { newTime, reason } = req.body;
    const patientId = req.user._id;

    if (!newTime) {
      return res.status(400).json({ error: "New time is required" });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Verify this is the patient's appointment
    if (appointment.patientId.toString() !== patientId.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check availability for new time
    const availability = await checkAvailability(
      appointment.facilityId,
      newTime,
      id
    );

    if (!availability.available) {
      return res.status(409).json({
        error: "Requested time slot is not available",
        conflicts: availability.conflicts,
      });
    }

    // Add to reschedule history
    appointment.rescheduleHistory.push({
      requestedBy: "patient",
      requestedById: patientId,
      originalTime: appointment.scheduledAt,
      proposedTime: new Date(newTime),
      reason: reason || "Personal schedule conflict",
      status: "pending",
    });

    // Update status
    appointment.status = "pending_staff_review";
    await appointment.save();

    // Notify staff
    await notificationService.sendRescheduleRequest(id, newTime, "patient");

    const populated = await Appointment.findById(id)
      .populate("facilityId", "name")
      .populate("patientId", "name phone")
      .populate("staffId", "name");

    res.json({
      success: true,
      appointment: populated,
      message: "Reschedule request sent to staff for review",
    });
  } catch (error) {
    console.error("Error requesting reschedule:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Respond to a reschedule request (approve or reject)
 * POST /api/appointments/:id/reschedule/respond
 */
const respondToReschedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // "approve" or "reject"
    const userId = req.user._id;
    const userRole = req.user.role;

    if (!["approve", "reject"].includes(action)) {
      return res
        .status(400)
        .json({ error: "Invalid action. Must be 'approve' or 'reject'" });
    }

    const appointment = await Appointment.findById(id)
      .populate("patientId", "name phone")
      .populate("staffId", "name");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Get the latest pending reschedule request
    const latestReschedule = appointment.rescheduleHistory
      .filter((r) => r.status === "pending")
      .sort((a, b) => b.createdAt - a.createdAt)[0];

    if (!latestReschedule) {
      return res
        .status(400)
        .json({ error: "No pending reschedule request found" });
    }

    // Verify the responder is authorized
    const isStaffResponse =
      userRole === "staff" && appointment.status === "pending_staff_review";
    const isPatientResponse =
      appointment.patientId._id.toString() === userId.toString() &&
      appointment.status === "reschedule_pending_patient";

    if (!isStaffResponse && !isPatientResponse) {
      return res.status(403).json({
        error: "Not authorized to respond to this reschedule request",
      });
    }

    // Update reschedule history
    latestReschedule.status = action === "approve" ? "approved" : "rejected";
    latestReschedule.respondedBy = userId;
    latestReschedule.respondedAt = new Date();

    if (action === "approve") {
      // Update appointment time and status
      appointment.scheduledAt = latestReschedule.proposedTime;
      appointment.status = "confirmed";

      // Reschedule SMS reminders if applicable
      if (appointment.patientId.consentSms) {
        await reminderService.scheduleReminders(
          appointment._id,
          appointment.patientId.phone,
          latestReschedule.proposedTime
        );
      }
    } else {
      // Rejection - revert to confirmed status (or pending if no staff assigned)
      appointment.status = appointment.staffId ? "confirmed" : "pending";
    }

    await appointment.save();

    // Send notification
    const respondedBy = isStaffResponse ? "staff" : "patient";
    await notificationService.sendRescheduleResponse(id, action, respondedBy);

    const populated = await Appointment.findById(id)
      .populate("facilityId", "name")
      .populate("patientId", "name phone")
      .populate("staffId", "name");

    res.json({
      success: true,
      appointment: populated,
      message: `Reschedule request ${action}d successfully`,
    });
  } catch (error) {
    console.error("Error responding to reschedule:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get reschedule history for an appointment
 * GET /api/appointments/:id/reschedule/history
 */
const getRescheduleHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("rescheduleHistory.requestedById", "name role")
      .populate("rescheduleHistory.respondedBy", "name role");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({
      success: true,
      history: appointment.rescheduleHistory,
    });
  } catch (error) {
    console.error("Error fetching reschedule history:", error);
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
  // New workflow functions
  confirmAppointment,
  staffProposeReschedule,
  patientRequestReschedule,
  respondToReschedule,
  getRescheduleHistory,
  checkAvailability, // Export for potential reuse
};
