const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RevokedToken = require("../models/RevokedToken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "No authentication token provided" });
    }

    // Verify the token using the local JWT secret. Tokens created by this server put the user id
    // in `sub` and include a `jti` for potential revocation tracking.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.sub || decoded.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Invalid authentication token (no subject)" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach useful info to the request for downstream handlers
    req.user = user;
    req.token = token;
    req.jti = decoded.jti;
    req.jwtRole = decoded.role;
    req.jwtExp = decoded.exp;

    // Check if this token jti has been revoked
    if (decoded.jti) {
      const revoked = await RevokedToken.findOne({ jti: decoded.jti }).lean();
      if (revoked) {
        return res.status(401).json({ error: "Token has been revoked" });
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid authentication token" });
  }
};

module.exports = { auth };
