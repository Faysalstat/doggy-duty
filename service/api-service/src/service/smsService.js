"use strict";
const api = require("../../node_modules/clicksend/api.js");

exports.sendSms = async () => {
  var smsMessage = new api.SmsMessage();
  smsMessage.from = "+18339724310";
  smsMessage.to = "+18633995176";
  smsMessage.body = "test NodeJS";
  var smsApi = new api.SMSApi(
    "DoggyDuty",
    "5DC8CA89-EBCB-EF6D-0EB7-2D317B42ED79"
  );
  var smsCollection = new api.SmsMessageCollection();
  smsCollection.messages = [smsMessage];
  const smsResponse = await smsApi.smsSendPost(smsCollection);
  console.log(smsResponse);
  
  return smsResponse;
};
