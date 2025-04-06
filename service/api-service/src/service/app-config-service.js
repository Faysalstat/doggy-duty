const { Op } = require("sequelize");
const AppConfig = require("../model/app-config");
const logger = require("../../logger");

exports.addConfig = async (req, res) => {
  let payload = req.body;
  try {
    let config = {
      configName: payload.configName,
      value: payload.value,
    };
    let response = await AppConfig.create(config);
    return res.status(201).json({
      message: "Config Created",
      body: response,
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(400).json({
      message: "Operation Failed: " + error.message,
      isSuccess: false,
    });
  }
};

exports.getAll = async (req, res, next) => {
  try {
    let response = await AppConfig.findAll();
    return res.status(200).json({
      message: "App config Retrieved",
      body: response,
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};

exports.getAllByName = async (req, res, next) => {
  let params = req.query;
  let query = {};
  try {
    if (params.configNames) {
      query.configName = {
      [Op.in]: params.configNames.split(','),
      };
    }
    let response = await AppConfig.findAll();
    return res.status(200).json({
      message: "App config Retrieved",
      body: response,
    });
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};

exports.updateConfig = async (req, res) => {
  let payload = req.body;
  try {
    let config = {
      value: payload.value,
    };
    let response = await AppConfig.update(config,{where:{configName:payload.configName}});
    return res.status(201).json({
      message: "Config Updated",
      body: response,
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(400).json({
      message: "Operation Failed: " + error.message,
      isSuccess: false,
    });
  }
};