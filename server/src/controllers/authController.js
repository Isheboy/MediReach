const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  try {
    const { name, phone, role, facilityId, consentSms } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    const user = new User({
      name,
      phone,
      role: role || 'patient',
      facilityId: role === 'staff' ? facilityId : undefined,
      consentSms: consentSms !== undefined ? consentSms : true
    });

    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        facilityId: user.facilityId,
        consentSms: user.consentSms
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone }).populate('facilityId');
    if (!user) {
      return res.status(401).json({ error: 'Invalid phone number' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        facilityId: user.facilityId,
        consentSms: user.consentSms
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login };