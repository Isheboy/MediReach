const twilio = require("twilio");

class TwilioAdapter {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async send(to, message) {
    try {
      // Prepare message options
      const messageOptions = {
        body: message,
        to,
      };

      // Use Messaging Service SID if available (recommended for production)
      // Otherwise fall back to direct phone number
      if (process.env.TWILIO_MESSAGING_SERVICE_SID) {
        messageOptions.messagingServiceSid =
          process.env.TWILIO_MESSAGING_SERVICE_SID;
      } else {
        messageOptions.from = process.env.TWILIO_FROM;
      }

      const result = await this.client.messages.create(messageOptions);

      console.log("[Twilio] SMS sent:", result.sid);

      return {
        success: true,
        provider: "twilio",
        messageId: result.sid,
        status: result.status,
      };
    } catch (error) {
      console.error("[Twilio] Error:", error);
      throw error;
    }
  }
}

module.exports = TwilioAdapter;
