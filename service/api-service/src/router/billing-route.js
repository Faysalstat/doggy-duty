const express = require('express');
const router = express.Router();
const billingController = require('../controller/billing-controller')


router.get('/getall',billingController.getBillByCommunityId);
module.exports = router