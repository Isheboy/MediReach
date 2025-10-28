const Reminder = require("../models/Reminder");

// Handler for Africa's Talking delivery receipts
const atCallback = async (req, res) => {
  try {
    const payload = req.body || {};

    // Normalize common shapes
    const messageId =
      payload.messageId ||
      (payload.SMSMessageData &&
        payload.SMSMessageData.Recipients &&
        payload.SMSMessageData.Recipients[0] &&
        payload.SMSMessageData.Recipients[0].messageId);
    const status =
      payload.status ||
      (payload.SMSMessageData &&
        payload.SMSMessageData.Recipients &&
        payload.SMSMessageData.Recipients[0] &&
        payload.SMSMessageData.Recipients[0].status);
    const number =
      payload.number ||
      (payload.SMSMessageData &&
        payload.SMSMessageData.Recipients &&
        payload.SMSMessageData.Recipients[0] &&
        payload.SMSMessageData.Recipients[0].number);

    if (!messageId) {
      console.warn("AT callback without messageId:", payload);
      return res.status(200).send("ok");
    }

    // Try to find by providerMessageId first
    let reminder = await Reminder.findOne({ providerMessageId: messageId });

    // Fallback: try to find by phone and recent scheduled send
    if (!reminder && number) {
      reminder = await Reminder.findOne({ patientPhone: number }).sort({
        scheduledSendAt: -1,
      });
    }

    if (!reminder) {
      console.warn("No matching reminder for delivery receipt", messageId);
      return res.status(200).send("ok");
    }

    // Update reminder based on status
    const update = { providerResponse: payload };
    if (status && String(status).toLowerCase().includes("delivered")) {
      update.status = "sent";
      update.sentAt = new Date();
    } else if (
      status &&
      (String(status).toLowerCase().includes("failed") ||
        String(status).toLowerCase().includes("undelivered"))
    ) {
      update.status = "failed";
    }

    await Reminder.findByIdAndUpdate(reminder._id, update);

    return res.status(200).send("ok");
  } catch (err) {
    console.error("Error processing AT callback", err);
    // ack to avoid retries but log error
    return res.status(200).send("ok");
  }
};

module.exports = { atCallback };

// Lookup reminder by providerMessageId (for debugging)
const getByProviderMessageId = async (req, res) => {
  try {
    const { messageId } = req.params;
    const reminder = await Reminder.findOne({ providerMessageId: messageId });
    if (!reminder) return res.status(404).json({ error: 'Not found' });
    return res.json(reminder);
  } catch (err) {
    console.error('Error fetching reminder by messageId', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports.getByProviderMessageId = getByProviderMessageId;
