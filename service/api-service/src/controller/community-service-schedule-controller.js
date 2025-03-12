const scheduleService = require("../service/community-service-schedule-service");

exports.addSchedule = async (req, res, next) => {
  try {
    let response = await scheduleService.addSchedule(req, res, next);
    return res.status(201).json({
      message: "Schedule Created",
      body: response,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Operation Failed: " + error.message,
      isSuccess: false,
    });
  }
};

exports.getAllSchedules = async (req, res, next) => {
  try {
    let response = await scheduleService.getAllSchedules(req, res, next);
    return res.status(200).json({
      message: "Schedules Retrieved",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};

exports.getScheduleById = async (req, res, next) => {
  try {
    let response = await scheduleService.getScheduleById(req, res, next);
    return res.status(200).json({
      message: "Schedule Retrieved",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};
