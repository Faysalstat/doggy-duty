const Community = require("../model/community");
const {CONFIG_NAMES } = require("../model/enums");
const CommonService = require("../service/common-service");
const db = require("../connector/db-connector");
const CommunityServiceSchedule = require("../model/communityServiceSchedule");
const Task = require("../model/task");
const JobOrder = require("../model/job-order");
const moment = require('moment');
const AppConfig = require("../model/app-config");

exports.addCommunity = async (req, res) => {
  try {
    let payload = req.body;

    // Convert incoming dates to UTC
    const lastServedDateUTC = new Date(); // Always store as UTC

    // Create Community entity
    let communityEntity = {
      communityName: payload.communityName,
      communityAddress: payload.communityAddress,
      latitude: payload.latitude,
      longitude: payload.longitude,
      camOfcommunity: payload.camOfcommunity,
      gateCode: payload.gateCode,
      phone: payload.phone,
      email: payload.email,
      lockBoxCode: payload.lockBoxCode,
      specialRequest: payload.specialRequest,
    };

    let newCommunity = await Community.create(communityEntity);

    // Create Community Service Schedule
    let communityServiceScheduleModel = {
      frequency: payload.frequency,
      startingDate: payload.startingDate,
      scheduledDate: payload.startingDate,
      lastServedDate: lastServedDateUTC,
      noOfPetStation: payload.noOfPetStation,
      noOfGarbageBin: payload.noOfGarbageBin,
      communityId: newCommunity.id,
      chargePerPetStation: payload.chargePerPetStation,
      chargePerGarbageBin: payload.chargePerGarbageBin,
    };

    let newCommunityServiceSchedule = await CommunityServiceSchedule.create(communityServiceScheduleModel);
    return {newCommunity,newCommunityServiceSchedule};

  } catch (error) {
    console.error("Error Occurred:", error);
    throw new Error("Error Occurred:", error);
  }
};
exports.updateCommunity = async (req, res) => {
  try {
    let payload = req.body;

    // Convert incoming dates to UTC
    const lastServedDateUTC = new Date(); // Always store as UTC

    // Update Community entity
    let communityEntity = {
      communityName: payload.communityName,
      communityAddress: payload.communityAddress,
      latitude: payload.latitude,
      longitude: payload.longitude,
      camOfcommunity: payload.camOfcommunity,
      gateCode: payload.gateCode,
      phone: payload.phone,
      email: payload.email,
      lockBoxCode: payload.lockBoxCode,
      specialRequest: payload.specialRequest,
    };

    let updatedCommunity = await Community.update(communityEntity, {
      where: { id: payload.id },
    });

    if (!updatedCommunity[0]) {
      throw new Error("Community not found.");
    }

    let community = await Community.findOne({
      where: { id: payload.id },
      include: CommunityServiceSchedule,
    });

    if (!community) {
      throw new Error("Community not found after update.");
    }

    // Update Community Service Schedule
    let communityServiceScheduleModel = {
      frequency: payload.frequency,
      startingDate: payload.startingDate,
      noOfPetStation: payload.noOfPetStation,
      noOfGarbageBin: payload.noOfGarbageBin,
      chargePerPetStation: payload.chargePerPetStation,
      chargePerGarbageBin: payload.chargePerGarbageBin,
    };

    let updatedSchedule = await CommunityServiceSchedule.update(
      communityServiceScheduleModel,
      {
        where: { id: community.communityServiceSchedule.id },
      }
    );

    if (!updatedSchedule[0]) {
      throw new Error("Community service schedule not found.");
    }

    // Construct response data
    const communityData = {
      communityId: community.id,
      communityName: community.communityName,
      communityAddress: community.communityAddress,
      latitude: community.latitude,
      longitude: community.longitude,
      gateCode: community.gateCode,
      camOfcommunity: community.camOfcommunity,
      phone: community.phone,
      email: community.email,
      lockBoxCode: community.lockBoxCode,
      specialRequest: community.specialRequest,
      noOfPetStation: payload.noOfPetStation,
      chargePerPetStation: payload.chargePerPetStation,
      noOfGarbageBin: payload.noOfGarbageBin,
      chargePerGarbageBin: payload.chargePerGarbageBin,
      startingDate: payload.startingDate,
      scheduledDate: payload.scheduledDate,
      frequency: payload.frequency,
    };

    return communityData;
  } catch (error) {
    console.error("Error Occurred:", error);
    throw new Error("Error Occurred: " + error.message);
  }
};
exports.getAllCommunitiesWithDistanceFromBase = async (req, res) => {
  let sortedCommunities = [];
  try {
    let communities = await Community.findAll({include:CommunityServiceSchedule});
    sortedCommunities = await CommonService.orderCommunitiesByProximity(JSON.parse(JSON.stringify(communities)));
    const result = sortedCommunities.map(community => {
      const communityData = {
        id: community.id,
        communityName: community.communityName,
        communityAddress: community.communityAddress,
        latitude:community.latitude,
        longitude:community.longitude,
        gateCode: community.gateCode,
        camOfcommunity: community.camOfcommunity,
        phone: community.phone,
        email: community.email,
        lockBoxCode: community.lockBoxCode,
        specialRequest: community.specialRequest,
        noOfPetStation: community.communityServiceSchedule.noOfPetStation,
        chargePerPetStation : community.communityServiceSchedule.chargePerPetStation ,
        noOfGarbageBin: community.communityServiceSchedule.noOfGarbageBin,
        chargePerGarbageBin: community.communityServiceSchedule.chargePerGarbageBin ,
        startingDate: community.communityServiceSchedule.startingDate ,
        scheduledDate: community.communityServiceSchedule.scheduledDate ,
        frequency: community.communityServiceSchedule.frequency ,
        distance: community.distance.toFixed(3),
      };
      return communityData;
    });
    return result;
  } catch (error) {
    throw new Error("Error Occurred: " + error.message);
  }
};

exports.getAllJobOrderByDate = async (params,userTimeZone) => {
  let jobquery = {};
  let taskquery = {};
  
  if(params.date && params.date != ""){
    jobquery.date = params.date;
  }else{
    jobquery.date = new Date();
  }

  if(params.status && params.status != ""){
    taskquery.status = params.status;
  }
  let sortedCommunities = [];
  try {
    let config = await AppConfig.findAll();
    let chargePerBagRoll = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_BAG_ROLL).value;
    let chargePerBinReplacement = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_BIN_REPLACEMENT).value;
    let chargePerNewStationInstallment = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_NEW_STATION_INSTALLMENT).value;
    let chargePerHandSanitizer = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_HAND_SANITIZER).value;
    let communities = await Community.findAll({
      include: [
        { model: CommunityServiceSchedule },
        {
          model: Task,
          required: true,
          where:taskquery,
          include: [
            {
              model: JobOrder,
              where: jobquery,
              required: true,
            },
          ],
        },
      ],
    });
    sortedCommunities = await CommonService.orderCommunitiesByProximity(JSON.parse(JSON.stringify(communities)));
    const result = sortedCommunities.map(community => {
      let scheduledDate;
      scheduledDate = community.communityServiceSchedule.scheduledDate;
      const communityData = {
        jobOrderId: community.tasks[0].jobOrderId, // Get jobOrderId from the first task or set to null
        taskId:community.tasks[0].id,
        taskStatus: community.tasks[0].status,
        communityId: community.id,
        communityName: community.communityName,
        communityAddress: community.communityAddress,
        gateCode: community.gateCode,
        camOfcommunity: community.camOfcommunity,
        phone: community.phone,
        email: community.email,
        lockBoxCode: community.lockBoxCode,
        specialRequest: community.specialRequest,
        noOfPetStation: community.communityServiceSchedule.noOfPetStation,
        noOfGarbageBin: community.communityServiceSchedule.noOfGarbageBin,
        noOfBagRollReplaced: 0,
        noOfBinReplacement: 0,
        noOfHandSanitizerReplacement: 0,
        noOfStationInstalled: 0,
        chargePerPetStation: community.communityServiceSchedule.chargePerPetStation,
        chargePerGarbageBin: community.communityServiceSchedule.chargePerGarbageBin,
        chargePerBagRoll: chargePerBagRoll || 0,
        chargePerBinReplacement: chargePerBinReplacement || 0,
        chargePerNewStationInstallment: chargePerNewStationInstallment || 0,
        chargePerHandSanitizer: chargePerHandSanitizer || 0,
        isBagRollReplaced: false, // Add your first extra property
        isBinReplaced: false, // Add your first extra property
        isHandSanitizerReplaced: false, // Add your first extra property
        isNewStationInstalled: false, // Add your first extra property
        totalBagReplacementPrice: 0,
        totalBinReplacementPrice: 0,
        totalStationInstallationPrice: 0,
        totalHandSanitizerPrice: 0,
        scheduledDate:  scheduledDate ,
        distance: community.distance.toFixed(3),
      };
      return communityData;
    });
    return result;
  } catch (error) {
    throw new Error("Error Occurred: " + error.message);
  }
};

exports.getCommunityById = async (req, res) => {
  let params = req.query;
  const userTimeZone = req.headers['timezone'] || 'UTC'; // Get timezone from header
  try {
    let community = await Community.findOne({where:{id:params.id},include:CommunityServiceSchedule});
    const communityData = {
      communityId: community.id,
      communityName: community.communityName,
      communityAddress: community.communityAddress,
      latitude:community.latitude,
      longitude:community.longitude,
      gateCode: community.gateCode,
      camOfcommunity: community.camOfcommunity,
      phone: community.phone,
      email: community.email,
      lockBoxCode: community.lockBoxCode,
      specialRequest: community.specialRequest,
      noOfPetStation: community.communityServiceSchedule.noOfPetStation,
      chargePerPetStation : community.communityServiceSchedule.chargePerPetStation ,
      noOfGarbageBin: community.communityServiceSchedule.noOfGarbageBin,
      chargePerGarbageBin: community.communityServiceSchedule.chargePerGarbageBin ,
      startingDate: community.communityServiceSchedule.startingDate,
      scheduledDate: community.communityServiceSchedule.scheduledDate,
      frequency: community.communityServiceSchedule.frequency
    };
    return communityData;
  } catch (error) {
    throw new Error("Error Occurred: " + error.message);
  }
};
exports.getAllCommunity = async (req, res) => {
  let modifiedommunities = [];
  try {
    let communities = await Community.findAll();
    modifiedommunities = JSON.parse(JSON.stringify(communities));
    const result = modifiedommunities.map(community => {
      const communityData = {
        id: community.id,
        communityName: community.communityName
      };
      return communityData;
    });
    return result;
  } catch (error) {
    throw new Error("Error Occurred: " + error.message);
  }
};

const setToMidnightUTC = (date) => {
  if (!date) return null;
  let dt = new Date(date);
  dt.setUTCHours(0, 0, 0, 0); // Set to 00:00:00 UTC
  return dt;
};