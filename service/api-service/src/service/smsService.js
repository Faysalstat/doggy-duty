"use strict";
const api = require("../../node_modules/clicksend/api.js");
const logger = require("../../logger");
exports.sendSms = async () => {
  const from = "+18339724310";
  const recipient1 = "+14074174915";
  const recipient2 = "+18633995176";
  const smsBody =
  "Doggy Duty, LLC\n\nNew Doggy Duty Work Order Created Today. Please visit www.DoggyDuty.Live to review and print your schedule.\n\nThank you!";
  var messages = [];
  var smsMessage1 = new api.SmsMessage();
  smsMessage1.from = from;
  smsMessage1.to = recipient1;
  smsMessage1.body = smsBody;
  messages.push(smsMessage1);
  var smsMessage2 = new api.SmsMessage();
  smsMessage2.from =from;
  smsMessage2.to = recipient2;
  smsMessage2.body = smsBody;
  messages.push(smsMessage2);
  var smsApi = new api.SMSApi(
    "DoggyDuty",
    "5DC8CA89-EBCB-EF6D-0EB7-2D317B42ED79"
  );
  try {
    var smsCollection = new api.SmsMessageCollection();
    smsCollection.messages = messages;
    const smsResponse = await smsApi.smsSendPost(smsCollection);
    console.log(smsResponse);
    return smsResponse;
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    let errorLog = await SchedulerLog.create({
      job_name: "Job Scheduler",
      job_type: "SMS",
      status: "FAILED",
      error_message: error.message,
    });
    throw new Error("SMS Sending Failed." + error.message);
  }

};
