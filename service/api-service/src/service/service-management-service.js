const { Op } = require("sequelize");
const Service = require("../model/service");
const logger = require("../../logger");
exports.addService = async (req, res) => {
  let payload = req.body;
  try {
    let serviceEntity = {
      serviceName: payload.serviceName,
      serviceCharge: payload.serviceCharge,
    };
    let newService = await Service.create(serviceEntity);
    return newService
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occured " + error.message);
  }
};

exports.getAllServices = async (req, res) => {
  try {
    let services = Service.findAll();
    return services;
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occured " + error.message);
  }
};

exports.getServiceById = async (req, res) => {
  let params = req.query;
  let query = {};
  try {
    if (params.id || params.id != "") {
      query.id = params.id;
    }
    let services = Service.findAll({ where: query });
    return services;
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occured " + error.message);
  }
};
