const mongoose = require("mongoose");

const RevokedTokenSchema = new mongoose.Schema({
  jti: { type: String, required: true, unique: true },
  revokedAt: { type: Date, default: () => new Date() },
  expiresAt: { type: Date, required: true },
});

// TTL index: remove revoked tokens when expiresAt is reached
RevokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("RevokedToken", RevokedTokenSchema);
