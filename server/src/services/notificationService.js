const smsService = require("./smsService");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

/**
 * Send confirmation notification to patient when staff confirms appointment
 * @param {String} appointmentId - The appointment ID
 * @param {String} status - The new status
 * @returns {Promise<Object>} - Notification result
 */
const sendConfirmationNotification = async (appointmentId, status) => {
  try {
    const appointment = await Appointment.findById(appointmentId)
      .populate("patientId", "name phone consentSms")
      .populate("facilityId", "name")
      .populate("staffId", "name");

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    const patient = appointment.patientId;
    const facility = appointment.facilityId;
    const staff = appointment.staffId;

    let message = "";

    // Use shorter messages to work with Twilio trial (single segment)
    const dateStr = new Date(appointment.scheduledAt).toLocaleDateString();
    const timeStr = new Date(appointment.scheduledAt).toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    if (status === "confirmed") {
      // Very short message for better delivery on trial
      message = `Appointment confirmed at ${facility.name}. See you soon! - MediReach`;
    } else if (status === "canceled") {
      message = `Appointment cancelled: ${dateStr} ${timeStr}. ${
        appointment.cancellationReason
          ? "Reason: " + appointment.cancellationReason
          : ""
      }`;
    } else if (status === "completed") {
      message = `Thank you for visiting ${facility.name}! - MediReach`;
    }

    console.log("🔔 Preparing to send notification...");
    console.log("   Patient:", patient.name);
    console.log("   Phone:", patient.phone);
    console.log("   Consent SMS:", patient.consentSms);
    console.log("   Message:", message);

    // Send SMS notification if patient has consented
    let smsResult = null;
    if (patient.consentSms && patient.phone) {
      console.log("📱 Sending SMS notification...");
      smsResult = await smsService.sendSms(patient.phone, message);
      console.log("✅ SMS Result:", JSON.stringify(smsResult, null, 2));
    } else {
      console.log(
        "⚠️ SMS not sent - consent:",
        patient.consentSms,
        "phone:",
        patient.phone
      );
    }

    // TODO: Add real-time push notification here
    // TODO: Add email notification here
    // TODO: Add in-app notification here

    return {
      success: true,
      sms: smsResult,
      message: "Notification sent successfully",
    };
  } catch (error) {
    console.error("❌ Error sending confirmation notification:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send reschedule request notification
 * @param {String} appointmentId - The appointment ID
 * @param {Date} newTime - The proposed new time
 * @param {String} requestedBy - Who initiated the reschedule (patient/staff)
 * @returns {Promise<Object>} - Notification result
 */
const sendRescheduleRequest = async (appointmentId, newTime, requestedBy) => {
  try {
    const appointment = await Appointment.findById(appointmentId)
      .populate("patientId", "name phone consentSms")
      .populate("facilityId", "name")
      .populate("staffId", "name consentSms");

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    const patient = appointment.patientId;
    const facility = appointment.facilityId;
    const staff = appointment.staffId;

    let message = "";
    let recipient = null;

    if (requestedBy === "staff") {
      // Notify patient about staff's reschedule proposal
      recipient = patient;
      message = `🔄 RESCHEDULE REQUEST: ${staff ? staff.name : "Staff"} at ${
        facility.name
      } has proposed to reschedule your appointment from ${new Date(
        appointment.scheduledAt
      ).toLocaleString()} to ${new Date(
        newTime
      ).toLocaleString()}. Please log in to approve or reject.`;
    } else if (requestedBy === "patient") {
      // Notify staff about patient's reschedule request
      recipient = staff || patient; // Fallback to patient if no staff assigned
      message = `🔄 RESCHEDULE REQUEST: ${
        patient.name
      } has requested to reschedule their appointment from ${new Date(
        appointment.scheduledAt
      ).toLocaleString()} to ${new Date(
        newTime
      ).toLocaleString()}. Please review and respond.`;
    }

    // Send SMS notification
    let smsResult = null;
    if (recipient && recipient.phone && recipient.consentSms) {
      smsResult = await smsService.sendSms(recipient.phone, message);
      console.log("📱 Reschedule request SMS sent:", smsResult);
    }

    // TODO: Add real-time push notification here
    // TODO: Add email notification here
    // TODO: Add in-app notification here

    return {
      success: true,
      sms: smsResult,
      message: "Reschedule request notification sent successfully",
    };
  } catch (error) {
    console.error("❌ Error sending reschedule request:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send reschedule response notification (approved/rejected)
 * @param {String} appointmentId - The appointment ID
 * @param {String} responseStatus - approved or rejected
 * @param {String} respondedBy - Who responded (patient/staff)
 * @returns {Promise<Object>} - Notification result
 */
const sendRescheduleResponse = async (
  appointmentId,
  responseStatus,
  respondedBy
) => {
  try {
    const appointment = await Appointment.findById(appointmentId)
      .populate("patientId", "name phone consentSms")
      .populate("facilityId", "name")
      .populate("staffId", "name consentSms");

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    const patient = appointment.patientId;
    const facility = appointment.facilityId;
    const staff = appointment.staffId;

    let message = "";
    let recipient = null;

    if (respondedBy === "staff" && responseStatus === "approved") {
      // Staff approved patient's reschedule request
      recipient = patient;
      message = `✅ RESCHEDULE APPROVED: Your reschedule request for ${
        facility.name
      } has been approved. New time: ${new Date(
        appointment.scheduledAt
      ).toLocaleString()}`;
    } else if (respondedBy === "staff" && responseStatus === "rejected") {
      // Staff rejected patient's reschedule request
      recipient = patient;
      message = `❌ RESCHEDULE REJECTED: Your reschedule request for ${
        facility.name
      } has been rejected. Original time remains: ${new Date(
        appointment.scheduledAt
      ).toLocaleString()}`;
    } else if (respondedBy === "patient" && responseStatus === "approved") {
      // Patient approved staff's reschedule proposal
      recipient = staff;
      message = `✅ RESCHEDULE APPROVED: ${
        patient.name
      } has approved the reschedule. New time: ${new Date(
        appointment.scheduledAt
      ).toLocaleString()}`;
    } else if (respondedBy === "patient" && responseStatus === "rejected") {
      // Patient rejected staff's reschedule proposal
      recipient = staff;
      message = `❌ RESCHEDULE REJECTED: ${
        patient.name
      } has rejected the reschedule proposal. Original time remains: ${new Date(
        appointment.scheduledAt
      ).toLocaleString()}`;
    }

    // Send SMS notification
    let smsResult = null;
    if (recipient && recipient.phone && recipient.consentSms) {
      smsResult = await smsService.sendSms(recipient.phone, message);
      console.log("📱 Reschedule response SMS sent:", smsResult);
    }

    // TODO: Add real-time push notification here
    // TODO: Add email notification here
    // TODO: Add in-app notification here

    return {
      success: true,
      sms: smsResult,
      message: "Reschedule response notification sent successfully",
    };
  } catch (error) {
    console.error("❌ Error sending reschedule response:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  sendConfirmationNotification,
  sendRescheduleRequest,
  sendRescheduleResponse,
};
