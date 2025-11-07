const express = require('express');
const router = express.Router();
const billingController = require('../controller/billing-controller');
const upload = require('../service/upload-service');


router.get('/getall',billingController.getBillByCommunityId);
router.get('/invoice-getall',billingController.getAllInvoices);
router. post('/invoice/pay',upload.single("file"),billingController.payInvoice);
router.get('/getsummary',billingController.getSummary);
// router.get('/generate',billingController.designInvoice)
module.exports = router