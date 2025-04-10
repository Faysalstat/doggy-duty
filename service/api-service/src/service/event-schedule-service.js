const EventSchedule = require("../model/event-schedule");

exports.addEventSchedule = async (req, res, next) => {
  try {
    let payload = req.body;
    let eventModel = {
    status: 'active',
    scheduledDate: payload.scheduledDate,
    scheduledTime: payload.scheduledTime,
    title: payload.title,
    description: payload.description
    }
    let response = await EventSchedule.create(eventModel);
    return response;
  } catch (error) {
    throw new Error("Not Created: " + error.message);
  }
};

exports.getAllEventSchedule = async (req, res, next) => {
  try {
    let response = await EventSchedule.findAll({
      where: { status: "active" },
      order: [[EventSchedule.sequelize.fn('STR_TO_DATE', EventSchedule.sequelize.col('scheduledDate'), '%Y-%m-%d'), 'ASC']]
    });
    return response;
  } catch (error) {
    throw new Error("Not Found: " + error.message);
  }
}
exports.getEventScheduleById = async (req, res, next) => {
  try {
    let response = await EventSchedule.findOne({
      where: { id: req.params.id, status: "active" }
    });
    if (!response) {
      throw new Error("Event Schedule not found");
    }
    return response;
  } catch (error) {
    throw new Error("Not Found: " + error.message);
  }
};
exports.updateEventSchedule = async (req, res, next) => {
    try {
        let payload = req.body;
        let eventModel = {
        scheduledDate: payload.scheduledDate,
        scheduledTime: payload.scheduledTime,
        title: payload.title,
        description: payload.description
        }
        let response = await EventSchedule.update(eventModel,{where: { id: payload.id }});
        return response;
      } catch (error) {
        throw new Error("Not Updated: " + error.message);
      }
};  
exports.deleteEventSchedule = async (req, res, next) => {
  try {
    let response = await EventSchedule.destroy({ where: { id: req.query.id } });
    return response;
  } catch (error) {
    throw new Error("Not Deleted: " + error.message);
  }
};