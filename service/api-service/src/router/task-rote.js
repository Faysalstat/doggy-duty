const express = require('express');
const router = express.Router();
const taskControler = require("../controller/task-controller");

router.get('/getall',taskControler.getAllTasks);
router.post('/complete',taskControler.getAllTasks);
module.exports = router