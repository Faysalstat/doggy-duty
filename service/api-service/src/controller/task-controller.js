const taskService = require("../service/task-service");
const scheduleService = require("../service/schedule-service");
const moment = require("moment-timezone");
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
    let today;
    let response;
    if(req.query.scheduledDate){
        today = req.query.scheduledDate;
    }else{
        today = moment().tz("America/New_York").format("YYYY-MM-DD");
    }
    const currentHour = moment().tz("America/New_York").format("HH");
    // if (currentHour === "06") {
    //   response = await scheduleService.generateDailyTasks(today);
    // } else {
    //   return res.status(400).json({
    //   message: "Tasks can only be generated at 6:00 AM",
    //   isSuccess: false,
    //   });
    // }
    response = await scheduleService.generateDailyTasks(today);
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
