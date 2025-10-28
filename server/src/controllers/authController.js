const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const RevokedToken = require("../models/RevokedToken");

// generateToken now accepts the user object so we can include role and a jti
const generateToken = (user) => {
  const payload = {
    sub: String(user._id),
    role: user.role || "patient",
    jti: uuidv4(),
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const register = async (req, res) => {
  try {
    const { name, phone, role, facilityId, consentSms } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: "Phone number already registered" });
    }

    const user = new User({
      name,
      phone,
      role: role || "patient",
      facilityId: role === "staff" ? facilityId : undefined,
      consentSms: consentSms !== undefined ? consentSms : true,
    });

    await user.save();
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        facilityId: user.facilityId,
        consentSms: user.consentSms,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone }).populate("facilityId");
    if (!user) {
      return res.status(401).json({ error: "Invalid phone number" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        facilityId: user.facilityId,
        consentSms: user.consentSms,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Logout - revoke current token by storing its jti in Mongo with expiry
const logout = async (req, res) => {
  try {
    // Expect auth middleware to have populated req.jti and req.jwtExp
    const jti = req.jti || null;
    const exp = req.jwtExp || null;

    if (!jti)
      return res
        .status(400)
        .json({ error: "No token jti available to revoke" });

    // Determine expiresAt from token exp (seconds since epoch)
    const expiresAt = exp
      ? new Date(exp * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Create a revoked token entry (ignore duplicates)
    await RevokedToken.findOneAndUpdate(
      { jti },
      { jti, revokedAt: new Date(), expiresAt },
      { upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, message: "Token revoked" });
  } catch (err) {
    console.error("Logout error", err);
    return res.status(500).json({ error: "Failed to revoke token" });
  }
};

module.exports = { register, login, logout };
