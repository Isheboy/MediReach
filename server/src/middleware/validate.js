const { validationResult } = require("express-validator");

// middleware to handle express-validator results
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.array().map((e) => ({ param: e.param, msg: e.msg })),
    });
  }
  return next();
}

module.exports = { validate };
