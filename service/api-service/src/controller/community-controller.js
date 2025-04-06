const communityService = require("../service/community-service");

exports.addCommunity = async (req, res, next) => {
  try {
    let response = await communityService.addCommunity(req, res, next);
    return res.status(201).json({
      message: "Community Created",
      body: response,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Operation Failed: " + error.message,
      isSuccess: false,
    });
  }
};
exports.updateCommunity = async (req, res, next) => {
  try {
    let response = await communityService.updateCommunity(req, res, next);
    return res.status(201).json({
      message: "Community Updated",
      body: response,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Operation Failed: " + error.message,
      isSuccess: false,
    });
  }
};

exports.getAllCommunitiesWithDistanceFromBase = async (req, res, next) => {
  try {
    let response = await communityService.getAllCommunitiesWithDistanceFromBase(req, res, next);
    return res.status(200).json({
      message: "Communities Retrieved",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};
exports.getAllSortedCommunities = async (req, res, next) => {
    try {
      let response = await communityService.getAllSortedCommunities(req, res, next);
      return res.status(200).json({
        message: "Communities Retrieved",
        body: response,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Not Found: " + error.message,
        isSuccess: false,
      });
    }
  };

exports.getCommunityById = async (req, res, next) => {
  try {
    let response = await communityService.getCommunityById(req, res, next);
    return res.status(200).json({
      message: "Community Retrieved",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};

exports.getAllCommunities = async (req, res, next) => {
  try {
    let response = await communityService.getAllCommunity(req, res, next);
    return res.status(200).json({
      message: "Communities Retrieved",
      body: response,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Not Found: " + error.message,
      isSuccess: false,
    });
  }
};
