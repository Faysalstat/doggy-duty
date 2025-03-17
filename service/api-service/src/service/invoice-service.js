const { Op } = require("sequelize");

exports.generateInvoices = async (params) => {
  try {
    let newService = await Service.create(serviceEntity);
    return newService
  } catch (error) {
    throw new Error("Error Occured " + error.message);
  }
};
