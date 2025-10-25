const AfricasTalking = require('africastalking');

class AfricasTalkingAdapter {
  constructor() {
    const africastalking = AfricasTalking({
      apiKey: process.env.AT_API_KEY,
      username: process.env.AT_USERNAME
    });
    this.sms = africastalking.SMS;
  }

  async send(to, message) {
    try {
      const result = await this.sms.send({
        to: [to],
        message,
        from: process.env.AT_FROM
      });

      console.log('[Africa\'s Talking] SMS sent:', result);
      
      return {
        success: true,
        provider: 'africastalking',
        result
      };
    } catch (error) {
      console.error('[Africa\'s Talking] Error:', error);
      throw error;
    }
  }
}

module.exports = AfricasTalkingAdapter;