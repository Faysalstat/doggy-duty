const { Op } = require("sequelize");
const logger = require("../../logger");
exports.generateInvoices = async (params) => {
  try {
    let newService = await Service.create(serviceEntity);
    return newService
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occured " + error.message);
  }
};
