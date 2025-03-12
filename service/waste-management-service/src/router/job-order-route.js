const express = require('express');
const router = express.Router();
const jobOrderController = require("../controller/job-order-controller");
const taskControler = require("../controller/task-controller");

router.get('/generate',taskControler.generateDailyTasks);
router.get('/getallbydate',jobOrderController.getAllJobOrderByDate);
module.exports = router