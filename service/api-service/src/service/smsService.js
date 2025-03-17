const api = require('../../node_modules/clicksend/api.js');

class SmsService {
  constructor() {
    this.smsApi = new api.SMSApi("DoggyDuty", "5DC8CA89-EBCB-EF6D-0EB7-2D317B42ED79");
  }

  async sendSms(to, body) {
    try {
      const smsMessage = new api.SmsMessage();
      smsMessage.source = "sdk";
      smsMessage.to = to;
      smsMessage.body = body;

      const smsCollection = new api.SmsMessageCollection();
      smsCollection.messages = [smsMessage];

      const response = await this.smsApi.smsSendPost(smsCollection);
      return response.body;
    } catch (error) {
      console.error("SMS sending error:", error.body);
      throw new Error("Failed to send SMS");
    }
  }
}

module.exports = new SmsService();
