const express = require('express');
const router = express.Router();
const billingController = require('../controller/billing-controller')


router.get('/getall',billingController.getBillByCommunityId);
router.get('/invoice-getall',billingController.getAllInvoices);
router.post('/invoice/pay',billingController.payInvoice);
router.get('/getsummary',billingController.getSummary);
module.exports = router