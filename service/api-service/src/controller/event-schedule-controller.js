const eventScheduleService = require("../service/event-schedule-service");
exports.addEventSchedule = async (req, res, next) => {
  try {
    let response = await eventScheduleService.addEventSchedule(req, res, next);
    return res.status(200).json({
      message: "Event Schedule Created",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};

exports.getAllEventSchedule = async (req, res, next) => {
  try {
    let response = await eventScheduleService.getAllEventSchedule(req, res, next);
    return res.status(200).json({
      message: "Event Schedule Retrieved",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};
exports.getEventScheduleById = async (req, res, next) => {
  try {
    let params = req.query;
    let response = await eventScheduleService.getEventScheduleById(params);
    return res.status(200).json({
      message: "Event Schedule Retrieved",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};  
exports.updateEventSchedule = async (req, res, next) => {
  try {
    let response = await eventScheduleService.updateEventSchedule(req, res, next);
    return res.status(200).json({
      message: "Event Schedule Updated",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};
exports.deleteEventSchedule = async (req, res, next) => {
  try {
    let response = await eventScheduleService.deleteEventSchedule(req, res, next);
    return res.status(200).json({
      message: "Event Schedule Deleted",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};