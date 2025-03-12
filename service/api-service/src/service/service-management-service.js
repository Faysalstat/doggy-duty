const { Op } = require("sequelize");
const Service = require("../model/service");

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
    throw new Error("Error Occured " + error.message);
  }
};

exports.getAllServices = async (req, res) => {
  try {
    let services = Service.findAll();
    return services;
  } catch (error) {
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
    throw new Error("Error Occured " + error.message);
  }
};
