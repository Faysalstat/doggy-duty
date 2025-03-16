const Billing = require("../model/billing");
const Community = require("../model/community");
const Task = require("../model/task");
const { Op } = require("sequelize");

exports.getBillByCommunityId = async (req, res, next) => {
  let params = req.query;
  let query = {};
  let startDate = new Date("2025-03-01");
  let endDate = new Date();
  try {
    if (params.communityId && params.communityId != "") {
      query.communityId = params.communityId;
    }

    if (params.status && params.status != "") {
      query.status = params.status;
    }
    if (params.endDate || params.endDate != "") {
      endDate = new Date(params.endDate);
    }
    if (params.startDate || params.startDate != "") {
      startDate = new Date(params.startDate);
    }
    query.taskCompletionDate = { [Op.between]: [startDate, endDate] };
    let response = await Billing.findAll({
      where: query,
      include: { model: Task, include: Community },
    });
    return response;
  } catch (error) {
    throw new Error("Error Occurred: " + error.message);
  }
};
