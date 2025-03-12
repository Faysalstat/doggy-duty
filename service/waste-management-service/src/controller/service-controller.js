const serviceManagerService = require("../service/service-management-service")

exports.addService = async (req,res,next)=>{
    try {
      let response = await serviceManagerService.addService(req,res,next);
      return res.status(201).json({
        message: "Service Created",
        body: response
      });
    } catch (error) {
      return res.status(400).json({
        message: "Operation Failed;" + error.message,
        isSuccess: false,
      });
    }
  }
exports.getAllServices = async (req,res,next)=>{
    try {
      let response = await serviceManagerService.getAllServices(req,res,next);
      return res.status(201).json({
        message: "Service Created",
        body: response
      });
    } catch (error) {
      return res.status(404).json({
        message: "Not Found." + error.message,
        isSuccess: false,
      });
    }
  }
exports.getServiceById = async (req,res,next)=>{
    try {
        let response = await serviceManagerService.getServiceById(req,res,next);
      return res.status(201).json({
        message: "Service Created",
        body: response
      });
    } catch (error) {
      return res.status(404).json({
        message: "Not Found." + error.message,
        isSuccess: false,
      });
    }
  }