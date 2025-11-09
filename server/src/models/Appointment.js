const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    service: {
      type: String,
      required: [true, "Service type is required"],
      trim: true,
    },
    scheduledAt: {
      type: Date,
      required: [true, "Appointment date/time is required"],
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "canceled",
        "completed",
        "reschedule_pending_patient", // Staff proposed new time, awaiting patient approval
        "pending_staff_review", // Patient requested new time, awaiting staff approval
      ],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    // Track reschedule history
    rescheduleHistory: [
      {
        requestedBy: {
          type: String,
          enum: ["patient", "staff"],
          required: true,
        },
        requestedById: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        originalTime: {
          type: Date,
          required: true,
        },
        proposedTime: {
          type: Date,
          required: true,
        },
        reason: {
          type: String,
          trim: true,
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        respondedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        respondedAt: {
          type: Date,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

appointmentSchema.index({ patientId: 1, scheduledAt: -1 });
appointmentSchema.index({ facilityId: 1, scheduledAt: -1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
