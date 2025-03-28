const taskService = require("../service/task-service");
const scheduleService = require("../service/schedule-service");
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
    let response = await scheduleService.generateDailyTasks();
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
