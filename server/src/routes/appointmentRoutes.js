const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  createAppointment,
  getPatientAppointments,
  getFacilityAppointments,
  updateAppointmentStatus,
  sendTestSms,
} = require("../controllers/appointmentController");
const {
  createAppointmentValidator,
  updateAppointmentStatusValidator,
} = require("../validators/appointmentValidators");
const { validate } = require("../middleware/validate");

router.post("/", auth, createAppointmentValidator, validate, createAppointment);
router.get("/", auth, getPatientAppointments);
router.get("/facility/:facilityId", auth, getFacilityAppointments);
router.patch(
  "/:id",
  auth,
  updateAppointmentStatusValidator,
  validate,
  updateAppointmentStatus
);
router.post("/:id/send-test-sms", auth, sendTestSms);

module.exports = router;
