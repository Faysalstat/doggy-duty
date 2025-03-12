const Community = require("../model/community");
const { BaseLocation } = require("../model/enums");
const CommonService = require("../service/common-service");
const db = require("../connector/db-connector");
const CommunityServiceSchedule = require("../model/communityServiceSchedule");
const Task = require("../model/task");
const JobOrder = require("../model/job-order");
const Service = require("../model/service");

exports.addCommunity = async (req, res) => {
  let payload = req.body;
  let services = [];
  try {
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
    let communityServiceScheduleModel = {
      frequency: payload.frequency,
      startingDate: payload.startingDate,
      scheduledDate: payload.scheduledDate,
      lastServedDate: new Date(),
      noOfPetStation: payload.noOfPetStation,
      noOfGarbageBin: payload.noOfGarbageBin,
      communityId: newCommunity.id,
      chargePerPetStation:payload.chargePerPetStation,
      chargePerGarbageBin:payload.chargePerGarbageBin
    };
    let newCommunityServiceSchedule =
      await CommunityServiceSchedule.create(communityServiceScheduleModel);

    return { newCommunity,newCommunityServiceSchedule};
  } catch (error) {
    throw new Error("Error Occurred: " + error.message);
  }
};
exports.updateCommunity = async (req, res) => {
  let payload = req.body;
  let services = [];
  try {
    let communityEntity = {
      id:payload.id,
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
    let updatedCommunity = await Community.update(communityEntity,{where:{id:payload.id}});
    let community = await Community.findOne({where:{id:payload.id},include:CommunityServiceSchedule});
    let communityServiceScheduleModel = {
      id:community.communityServiceSchedule.id,
      frequency: payload.frequency,
      startingDate: payload.startingDate,
      scheduledDate: payload.scheduledDate,
      lastServedDate: new Date(),
      noOfPetStation: payload.noOfPetStation,
      noOfGarbageBin: payload.noOfGarbageBin,
      communityId: payload.id,
      chargePerPetStation:payload.chargePerPetStation,
      chargePerGarbageBin:payload.chargePerGarbageBin
    };
    let newCommunityServiceSchedule =
      await CommunityServiceSchedule.update(communityServiceScheduleModel,{where:{id:community.communityServiceSchedule.id}});
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
      startingDate: community.communityServiceSchedule.startingDate ,
      scheduledDate: community.communityServiceSchedule.scheduledDate ,
      frequency: community.communityServiceSchedule.frequency
    };
    return communityData;
  } catch (error) {
    throw new Error("Error Occurred: " + error.message);
  }
};
exports.getAllCommunitiesWithDistanceFromBase = async (req, res) => {
  let sortedCommunities = [];
  try {
    let communities = await Community.findAll({include:CommunityServiceSchedule});
    sortedCommunities = CommonService.orderCommunitiesByProximity(JSON.parse(JSON.stringify(communities)));
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

exports.getAllJobOrderByDate = async (req, res) => {
  let params = req.query;
  let query = {};
  if(params.date && params.date != ""){
    query.date = params.date;
  }else{
    query.date = new Date();
  }
  let sortedCommunities = [];
  try {
    let communities = await Community.findAll({
      include: [
        { model: CommunityServiceSchedule },
        {
          model: Task,
          required: true,
          include: [
            {
              model: JobOrder,
              where: query,
              required: true,
            },
          ],
        },
      ],
    });
    sortedCommunities = CommonService.orderCommunitiesByProximity(JSON.parse(JSON.stringify(communities)));
    const result = sortedCommunities.map(community => {
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
        noOfPetStation: community.communityServiceSchedule.noOfPetStation,
        noOfGarbageBin: community.communityServiceSchedule.noOfGarbageBin,
        distance: community.distance.toFixed(3),
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
  let query = {};
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
      startingDate: community.communityServiceSchedule.startingDate ,
      scheduledDate: community.communityServiceSchedule.scheduledDate ,
      frequency: community.communityServiceSchedule.frequency
    };
    return communityData;
  } catch (error) {
    throw new Error("Error Occurred: " + error.message);
  }
};
