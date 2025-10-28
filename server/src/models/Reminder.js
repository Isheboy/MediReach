const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    patientPhone: {
      type: String,
      required: true,
    },
    scheduledSendAt: {
      type: Date,
      required: true,
    },
    sentAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["scheduled", "sent", "failed"],
      default: "scheduled",
    },
    offset: {
      type: String,
      enum: ["48h", "24h", "2h"],
      required: true,
    },
    providerResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
    providerMessageId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

reminderSchema.index({ appointmentId: 1, offset: 1 }, { unique: true });
reminderSchema.index({ status: 1, scheduledSendAt: 1 });

module.exports = mongoose.model("Reminder", reminderSchema);
