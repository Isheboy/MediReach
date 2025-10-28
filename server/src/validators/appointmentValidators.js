const { body, param } = require("express-validator");

const createAppointmentValidator = [
  body("facilityId")
    .notEmpty()
    .withMessage("facilityId is required")
    .isMongoId()
    .withMessage("facilityId must be a valid id"),
  body("service").trim().notEmpty().withMessage("service is required"),
  body("scheduledAt")
    .notEmpty()
    .withMessage("scheduledAt is required")
    .isISO8601()
    .withMessage("scheduledAt must be an ISO8601 date")
    .custom((value) => {
      const dt = new Date(value);
      if (isNaN(dt.getTime())) return false;
      if (dt <= new Date())
        throw new Error("scheduledAt must be in the future");
      return true;
    }),
  body("notes").optional().isString().withMessage("notes must be a string"),
  body("patientPhone")
    .optional()
    .matches(/^[+]?\d{7,15}$/)
    .withMessage(
      "patientPhone must be a valid phone number in E.164-like format"
    ),
];

const updateAppointmentStatusValidator = [
  param("id").isMongoId().withMessage("appointment id must be a valid id"),
  body("status")
    .notEmpty()
    .withMessage("status is required")
    .isIn(["pending", "confirmed", "canceled", "completed"])
    .withMessage(
      "status must be one of pending, confirmed, canceled, completed"
    ),
];

module.exports = {
  createAppointmentValidator,
  updateAppointmentStatusValidator,
};
