const express = require('express');
const router = express.Router();
const serviceController = require("../controller/service-controller");

router.post('/add',serviceController.addService);
router.get('/getall',serviceController.getAllServices);
router.get('/getbyid',serviceController.getServiceById);

module.exports = router