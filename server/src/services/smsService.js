const MockAdapter = require('../sms/mockAdapter');
const AfricasTalkingAdapter = require('../sms/africasTalkingAdapter');
const TwilioAdapter = require('../sms/twilioAdapter');

class SmsService {
  constructor() {
    this.provider = process.env.SMS_PROVIDER || 'mock';
    this.adapter = this.getAdapter();
  }

  getAdapter() {
    switch (this.provider) {
      case 'africastalking':
        return new AfricasTalkingAdapter();
      case 'twilio':
        return new TwilioAdapter();
      case 'mock':
      default:
        return new MockAdapter();
    }
  }

  async sendSms(to, message) {
    try {
      console.log(`[SMS Service] Sending SMS via ${this.provider}`);
      console.log(`[SMS Service] To: ${to}`);
      console.log(`[SMS Service] Message: ${message}`);

      const result = await this.adapter.send(to, message);
      
      console.log(`[SMS Service] Result:`, result);
      return result;
    } catch (error) {
      console.error('[SMS Service] Error:', error);
      throw error;
    }
  }
}

module.exports = new SmsService();