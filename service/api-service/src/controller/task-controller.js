const taskService = require("../service/task-service");
const scheduleService = require("../service/schedule-service");
const moment = require('moment-timezone');
exports.getAllTasks = async (req, res, next) => {
  try {
    let response = await taskService.getAllTasks(req, res, next);
    return res.status(200).json({
      message: "Tasks Retrieved",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};

exports.generateDailyTasks = async (req, res, next) => {
  try {
    let params = req.query;
    const todayEDT = moment.tz("America/New_York").format('YYYY-MM-DD');
    let response = await scheduleService.generateDailyTasks(todayEDT);
    return res.status(200).json({
      message: response
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};

exports.completeTask = async (req, res, next) => {
  try {
    let response = await taskService.completeTask(req, res, next);
    return res.status(200).json({
      message: "Task completed and Bill Created",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};

// exports.generateDailyTasks = async (req, res, next) => {
//   try {
//     let params = req.query;
//     const todayEDT = moment.tz("America/New_York");
//     let response = await taskService.generateDailyTasks(todayEDT);
//     return res.status(200).json({
//       message: response
//     });
//   } catch (error) {
//     return res.status(404).json({
//       message: "Not Found: " + error.message,
//       isSuccess: false,
//     });
//   }
// };
