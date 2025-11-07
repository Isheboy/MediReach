const User = require("../models/User");

const updateUserProfile = async (req, res) => {
  try {
    const { name, consentSms } = req.body;
    const user = req.user; // From auth middleware

    user.name = name || user.name;
    user.consentSms = consentSms !== undefined ? consentSms : user.consentSms;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      facilityId: user.facilityId,
      consentSms: user.consentSms,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { updateUserProfile };
