const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  createAppointment,
  getPatientAppointments,
  getAllAppointments,
  getStaffAppointments,
  getFacilityAppointments,
  updateAppointmentStatus,
  sendTestSms,
  // New workflow functions
  confirmAppointment,
  staffProposeReschedule,
  patientRequestReschedule,
  respondToReschedule,
  getRescheduleHistory,
} = require("../controllers/appointmentController");
const {
  createAppointmentValidator,
  updateAppointmentStatusValidator,
} = require("../validators/appointmentValidators");
const { validate } = require("../middleware/validate");

const { isStaff } = require("../middleware/isStaff");

// Basic CRUD operations
router.post("/", auth, createAppointmentValidator, validate, createAppointment);
router.get("/", auth, getPatientAppointments);
router.get("/all", auth, isStaff, getAllAppointments);
router.get("/staff", auth, isStaff, getStaffAppointments);
router.get("/facility/:facilityId", auth, getFacilityAppointments);
router.patch(
  "/:id",
  auth,
  updateAppointmentStatusValidator,
  validate,
  updateAppointmentStatus
);
router.post("/:id/send-test-sms", auth, sendTestSms);

// ============= NEW WORKFLOW ROUTES =============

// Staff confirms a pending appointment
router.post("/:id/confirm", auth, isStaff, confirmAppointment);

// Staff proposes a reschedule
router.post("/:id/reschedule/staff", auth, isStaff, staffProposeReschedule);

// Patient requests a reschedule
router.post("/:id/reschedule/patient", auth, patientRequestReschedule);

// Respond to reschedule request (approve/reject)
router.post("/:id/reschedule/respond", auth, respondToReschedule);

// Get reschedule history
router.get("/:id/reschedule/history", auth, getRescheduleHistory);

module.exports = router;
