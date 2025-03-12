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
      noOfPetStation: payload.noOfPetStation,
      noOfGarbageBin: payload.noOfGarbageBin,
      specialRequest: payload.specialRequest,
    };
    let newCommunity = await Community.create(communityEntity);
    if (payload.selectedServices && payload.selectedServices.length > 0) {
      let serviceList = payload.selectedServices;
      for (let i = 0; i < serviceList.length; i++) {
        let service = serviceList[i];
        let communityServiceScheduleModel = {
          frequency: payload.frequency,
          startingDate: payload.startingDate,
          lastServedDate: new Date(),
          serviceId: service.id,
          communityId: newCommunity.id,
        };
        let newCommunityServiceSchedule =
          await CommunityServiceSchedule.create(communityServiceScheduleModel);
          services.push(newCommunityServiceSchedule);
      }
    }

    return { newCommunity,services};
  } catch (error) {
    throw new Error("Error Occurred: " + error.message);
  }
};

exports.getAllCommunitiesWithDistanceFromBase = async (req, res) => {
  let sortedCommunities = [];
  try {
    let communities = await Community.findAll();
    sortedCommunities = CommonService.orderCommunitiesByProximity(JSON.parse(JSON.stringify(communities)));
    return sortedCommunities; // Return the sorted list as a JSON response
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
    let communities = await Community.findAll({include:{
      model: Task,
      required: true,
      include:[{
        model:JobOrder,
        where:query,
        required: true,
      }]
    }});
    sortedCommunities = CommonService.orderCommunitiesByProximity(JSON.parse(JSON.stringify(communities)));
    const result = sortedCommunities.map(community => {
      const communityData = {
        jobOrderId: community.tasks.length > 0 ? community.tasks[0].jobOrder?.id : null, // Get jobOrderId from the first task or set to null
        communityId: community.id,
        communityName: community.communityName,
        communityAddress: community.communityAddress,
        gateCode: community.gateCode,
        camOfcommunity: community.camOfcommunity,
        phone: community.phone,
        email: community.email,
        lockBoxCode: community.lockBoxCode,
        specialRequest: community.specialRequest,
        noOfPetStation: community.noOfPetStation,
        noOfGarbageBin: community.noOfGarbageBin,
        // latitude: community.latitude,
        // longitude: community.longitude,
        distance: community.distance.toFixed(3),
        tasks: community.tasks ? community.tasks.map(task => ({
          id: task.id,
          status: task.status,
          scheduledTime: task.scheduledTime,
          service:task.service
        })) : [],
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
    if (params.id && params.id !== "") {
      query.id = params.id;
    }
    let community = await Community.findAll({ where: query });
    return community;
  } catch (error) {
    throw new Error("Error Occurred: " + error.message);
  }
};
