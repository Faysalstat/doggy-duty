const taskService = require("../service/task-service");

// exports.addTask = async (req, res, next) => {
//   try {
//     let response = await taskService.addTask(req, res, next);
//     return res.status(201).json({
//       message: "Task Created",
//       body: response,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       message: "Operation Failed: " + error.message,
//       isSuccess: false,
//     });
//   }
// };

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
    let response = await taskService.generateDailyTasks(req, res, next);
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
    let response = await taskService.generateDailyTasks(req, res, next);
    return res.status(200).json({
      message: "Task and Job order created",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};
