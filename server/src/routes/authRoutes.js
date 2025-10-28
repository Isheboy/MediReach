const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidators");
const { validate } = require("../middleware/validate");

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/logout", auth, logout);

module.exports = router;
