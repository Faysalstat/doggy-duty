const express = require('express');
const router = express.Router();
const communityController = require("../controller/community-controller");

router.post('/create',communityController.addCommunity);
router.post('/update',communityController.updateCommunity);
router.get('/getall',communityController.getAllCommunities);
router.get('/getallsorted',communityController.getAllSortedCommunities);
router.get('/getallbydistance',communityController.getAllCommunitiesWithDistanceFromBase);
router.get('/getbyid',communityController.getCommunityById);

module.exports = router