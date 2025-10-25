const twilio = require('twilio');

class TwilioAdapter {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async send(to, message) {
    try {
      const result = await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_FROM,
        to
      });

      console.log('[Twilio] SMS sent:', result.sid);
      
      return {
        success: true,
        provider: 'twilio',
        messageId: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('[Twilio] Error:', error);
      throw error;
    }
  }
}

module.exports = TwilioAdapter;