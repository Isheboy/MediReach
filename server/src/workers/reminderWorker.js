require("dotenv").config();
const mongoose = require("mongoose");
const Reminder = require("../models/Reminder");
const Appointment = require("../models/Appointment");
const smsService = require("../services/smsService");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/medireach";
const POLL_INTERVAL_MS =
  (process.env.REMINDER_POLL_INTERVAL_SECONDS || 60) * 1000;
const BATCH_SIZE = 50;
const MAX_RETRIES = 2; // number of retry attempts for sending

async function sendReminder(reminder) {
  try {
    // populate appointment details
    const appointment = await Appointment.findById(reminder.appointmentId)
      .populate("facilityId", "name")
      .populate("patientId", "name phone");

    const scheduled =
      appointment && appointment.scheduledAt
        ? appointment.scheduledAt.toLocaleString()
        : "";
    const message = `Reminder: Hello, you have an appointment at ${
      appointment?.facilityId?.name || ""
    } on ${scheduled}.`;

    let attempt = 0;
    let lastError = null;
    while (attempt <= MAX_RETRIES) {
      try {
        const result = await smsService.sendSms(reminder.patientPhone, message);
        reminder.status = "sent";
        reminder.sentAt = new Date();
        reminder.providerResponse = result;
        await reminder.save();
        console.log(
          `✅ Reminder ${reminder._id} sent to ${reminder.patientPhone}`
        );
        return;
      } catch (err) {
        attempt++;
        lastError = err;
        console.warn(
          `Attempt ${attempt} failed for reminder ${reminder._id}:`,
          err.message || err
        );
        if (attempt > MAX_RETRIES) break;
        // simple backoff
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }

    // If we reach here, all retries failed
    reminder.status = "failed";
    reminder.providerResponse = {
      error: lastError ? lastError.message || lastError : "unknown",
    };
    await reminder.save();
    console.error(
      `❌ Reminder ${reminder._id} failed after ${attempt} attempts`
    );
  } catch (err) {
    console.error("Error in sendReminder:", err);
  }
}

async function poll() {
  try {
    const now = new Date();
    const dueReminders = await Reminder.find({
      status: "scheduled",
      scheduledSendAt: { $lte: now },
    }).limit(BATCH_SIZE);
    if (dueReminders.length > 0) {
      console.log(`Found ${dueReminders.length} reminders due`);
      for (const r of dueReminders) {
        // mark as sending to avoid duplicate workers (best-effort)
        try {
          const locked = await Reminder.findOneAndUpdate(
            { _id: r._id, status: "scheduled" },
            { status: "sending" },
            { new: true }
          );
          if (!locked) continue; // somebody else picked it
          await sendReminder(locked);
        } catch (err) {
          console.error("Error locking/sending reminder", r._id, err);
        }
      }
    }
  } catch (err) {
    console.error("Polling error:", err);
  }
}

async function start() {
  await mongoose.connect(MONGO_URI);
  console.log("Reminder worker connected to MongoDB");
  // initial run
  await poll();
  setInterval(poll, POLL_INTERVAL_MS);
}

start().catch((err) => {
  console.error("Worker start error:", err);
  process.exit(1);
});
