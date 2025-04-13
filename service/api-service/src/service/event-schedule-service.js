const EventSchedule = require("../model/event-schedule");

exports.addEventSchedule = async (req, res, next) => {
  try {
    let payload = req.body;
    let eventModel = {
    status: 'active',
    scheduledDate: payload.scheduledDate,
    communityName: payload.communityName,
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
    let params = req.query;
    let query = {};
    if(params.status) {
      query.status = params.status.toLowerCase();
    }else {
      query.status = 'active';
    }
    if(params.scheduledDate && params.scheduledDate !== "") {
      query.scheduledDate = params.scheduledDate;
    }
    let response = await EventSchedule.findAll({
      where: query,
      order: [[EventSchedule.sequelize.fn('STR_TO_DATE', EventSchedule.sequelize.col('scheduledDate'), '%m-%d-%Y'), 'ASC']]
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
        communityName: payload.communityName,
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