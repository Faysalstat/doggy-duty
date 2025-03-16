const { Op } = require("sequelize");
const AppConfig = require("../model/app-config");

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
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};
