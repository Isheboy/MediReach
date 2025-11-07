const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, sparse: true, unique: true },
    phone: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: function (v) {
          return /^\+255\d{9}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid Tanzanian phone number!`,
      },
    },
    password: { type: String }, // Password for staff/admin login
    role: { type: String, enum: ["patient", "staff", "admin"], required: true },
    facilityId: { type: mongoose.Schema.Types.ObjectId, ref: "Facility" },
    consentSms: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ phone: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
