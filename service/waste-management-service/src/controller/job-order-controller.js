const communityService = require("../service/community-service");


exports.getAllJobOrderByDate = async (req, res, next) => {
  try {
    let response = await communityService.getAllJobOrderByDate(req, res, next);
    return res.status(200).json({
      message: "Job Order Retrieved",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};
