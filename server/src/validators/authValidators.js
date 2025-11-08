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
    .withMessage("phone or email is required")
    .custom((value) => {
      // Accept either email format or phone format
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isPhone = /^[+]?\d{7,15}$/.test(value);
      if (!isEmail && !isPhone) {
        throw new Error("Must be a valid email or phone number");
      }
      return true;
    }),
];

module.exports = { registerValidator, loginValidator };
