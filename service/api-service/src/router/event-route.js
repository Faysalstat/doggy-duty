const express = require('express');
const router = express.Router();
const eventScheduleController = require('../controller/event-schedule-controller')


router.post('/create',eventScheduleController.addEventSchedule);
router.get('/getall',eventScheduleController.getAllEventSchedule);
router.get('/get/:id',eventScheduleController.getEventScheduleById);
router.post('/update',eventScheduleController.updateEventSchedule);
router.delete('/delete',eventScheduleController.deleteEventSchedule);
module.exports = router