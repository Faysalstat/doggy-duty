const express = require('express');
const router = express.Router();
const taskControler = require("../controller/task-controller");

router.get('/generate',taskControler.generateDailyTasks);
router.get('/getall',taskControler.getAllTasks);
module.exports = router