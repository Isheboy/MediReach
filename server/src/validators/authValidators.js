const { body } = require("express-validator");

const phoneE164 = /^?\+?[1-9]\d{1,14}$/; // permissive E.164-ish regex

const registerValidator = [
  body("name").trim().notEmpty().withMessage("name is required"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("phone is required")
    .matches(/^[+]?\d{7,15}$/)
    .withMessage("phone must be a valid phone number in E.164-like format"),
  body("role")
    .optional()
    .isIn(["patient", "staff", "admin"])
    .withMessage("role must be one of patient, staff, admin"),
  body("facilityId")
    .optional()
    .isMongoId()
    .withMessage("facilityId must be a valid id"),
  body("consentSms")
    .optional()
    .isBoolean()
    .withMessage("consentSms must be a boolean"),
];

const loginValidator = [
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("phone is required")
    .matches(/^[+]?\d{7,15}$/)
    .withMessage("phone must be a valid phone number in E.164-like format"),
];

module.exports = { registerValidator, loginValidator };
