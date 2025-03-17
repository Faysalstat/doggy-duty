const smsService = require('../service/smsService');

exports.sendSms = async (req, res) => {
  try {
    // const { messages } = req.body;

    // if (!messages || !Array.isArray(messages) || messages.length === 0) {
    //   return res.status(400).json({ error: "Messages array is required" });
    // }
    const smsPayload = {
      messages: [
        {
          body: "New Doggy Duty Work Order Created Today. Please visit www.DoggyDuty.Live to review and print your schedule.",
          to: "+407-417-4915"
        },
        {
          body: "New Doggy Duty Work Order Created Today. Please visit www.DoggyDuty.Live to review and print your schedule.",
          to: "+8633995176"
        }
      ]
    };
    const { messages } = smsPayload;
    const response = await smsService.sendSms(messages);
    res.status(200).json({ message: "SMS request sent successfully", response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
