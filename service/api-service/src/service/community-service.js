const Community = require("../model/community");
const { BaseLocation, TASK_STATUS } = require("../model/enums");
const CommonService = require("../service/common-service");
const db = require("../connector/db-connector");
const CommunityServiceSchedule = require("../model/communityServiceSchedule");
const Task = require("../model/task");
const JobOrder = require("../model/job-order");
const moment = require('moment');

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
      startingDate: setToMidnightUTC(payload.startingDate),
      scheduledDate: setToMidnightUTC(payload.scheduledDate),
      lastServedDate: setToMidnightUTC(new Date()), // Assuming you want the current date as midnight
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
      if(userTimeZone){
        scheduledDate = moment.utc(community.communityServiceSchedule.scheduledDate).tz(userTimeZone).format('YYYY-MM-DD HH:mm:ss');
      }else{
        scheduledDate = community.communityServiceSchedule.scheduledDate;
      }
      const communityData = {
        jobOrderId: community.task.jobOrder?.id, // Get jobOrderId from the first task or set to null
        communityId: community.id,
        communityName: community.communityName,
        communityAddress: community.communityAddress,
        gateCode: community.gateCode,
        camOfcommunity: community.camOfcommunity,
        phone: community.phone,
        email: community.email,
        lockBoxCode: community.lockBoxCode,
        specialRequest: community.specialRequest,
        noOfPetStation: community.task.noOfPetStation,
        chargePerPetStation: community.task.chargePerPetStation,
        noOfGarbageBin: community.task.noOfGarbageBin,
        chargePerGarbageBin: community.task.chargePerGarbageBin,
        noOfBagRollReplaced: community.task.noOfBagRollReplaced,
        chargePerBagRoll: community.task.chargePerBagRoll,
        distance: community.distance.toFixed(3),
        scheduledDate:  scheduledDate ,
        taskId:community.task.id,
        taskStatus: community.task.status
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