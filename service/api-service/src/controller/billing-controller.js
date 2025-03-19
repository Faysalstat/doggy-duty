const billingService = require("../service/billing-service");

exports.generateInvoice = async (req, res, next) => {
  try {
    let response = await billingService.generateInvoice(req, res, next);
    return res.status(201).json({
      message: "Invoice Generated",
      body: response,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Operation Failed: " + error.message,
      isSuccess: false,
    });
  }
};

exports.getAllInvoices = async (req, res, next) => {
  try {
    let response = await billingService.getAllInvoices(req, res, next);
    return res.status(200).json({
      message: "Invoices Retrieved",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};

exports.getBillByCommunityId = async (req, res, next) => {
  try {
    let response = await billingService.getBillByCommunityId(req, res, next);
    return res.status(200).json({
      message: "Invoice Retrieved",
      count:response.length,
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};


