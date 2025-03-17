const express = require('express');
const smsController = require('../controller/sms-controller');

const router = express.Router();

router.post('/send-sms', smsController.sendSms);

module.exports = router;
