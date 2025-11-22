const Community = require("../model/community");
const {CONFIG_NAMES } = require("../model/enums");
const CommonService = require("../service/common-service");
const CommunityServiceSchedule = require("../model/communityServiceSchedule");
const Task = require("../model/task");
const JobOrder = require("../model/job-order");
const AppConfig = require("../model/app-config");
const moment = require("moment-timezone");
const logger = require("../../logger");
const ScheduledDays = require("../model/scheduled-days");
const { is } = require("bluebird");
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
exports.addCommunity = async (req, res) => {
  let createdSchedules;
  let newCommunityServiceSchedule;
  let newCommunity;
  try {
    let payload = req.body;
    const today = moment().tz("America/New_York");
    
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

    newCommunity = await Community.create(communityEntity);

    // Create Community Service Schedule
    let communityServiceScheduleModel = {
      frequency: payload.frequency,
      startingDate: payload.startingDate,
      lastServedDate: moment().tz("America/New_York").format("YYYY-MM-DD"),
      lastInvoiceGenerated: payload.startingDate,
      noOfPetStation: payload.noOfPetStation,
      noOfGarbageBin: payload.noOfGarbageBin,
      communityId: newCommunity.id,
      chargePerPetStation: payload.chargePerPetStation,
      chargePerGarbageBin: payload.chargePerGarbageBin,
      isPaused: payload.isPaused,
      isTaxApplicable: payload.isTaxApplicable,
      isFlatRate: payload.isFlatRate,
      flatRateAmount: payload.flatRateAmount,
      serviceName: payload.serviceName,
    };
    newCommunityServiceSchedule = await CommunityServiceSchedule.create(communityServiceScheduleModel);
    if (payload.scheduledDaysOfWeek.length > 0) {
      let scheduledDaysArray = daysOfWeek.map((day) => {
        let isSelected = payload.scheduledDaysOfWeek.includes(day);
        let scheduledDayData = {
          scheduledDay: day,
          isSelected: isSelected,
          communityServiceScheduleId:newCommunityServiceSchedule.id,
          lastServedDate: "2025-01-01"
        };
        return scheduledDayData;
      });
      createdSchedules = await ScheduledDays.bulkCreate(scheduledDaysArray);
    }
    return {newCommunity,newCommunityServiceSchedule};

  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    
    if(newCommunity){
      if(newCommunityServiceSchedule){
        if(createdSchedules){
          let deletedDays = await ScheduledDays.destroy({where:{communityServiceScheduleId:newCommunityServiceSchedule.id}});
        }
        let deletedSchedule = await CommunityServiceSchedule.destroy({where:{communityId:newCommunity.id}});
      }
      let deletedCommunity = await Community.destroy({where:{id:newCommunity}});
    }
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
      isPaused: payload.isPaused,
      isTaxApplicable: payload.isTaxApplicable,
      isFlatRate: payload.isFlatRate,
      flatRateAmount: payload.flatRateAmount,
      serviceName: payload.serviceName,
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
      scheduledDaysOfWeek: payload.scheduledDaysOfWeek,
      frequency: payload.frequency,
      
    };
    if (payload.scheduledDaysOfWeek.length > 0) {
      // Create an array of scheduled days
      let existingScheduledDays = await ScheduledDays.findAll({ where: { communityServiceScheduleId: community.communityServiceSchedule.id } });
      let updatedScheduledDays = existingScheduledDays.map((day) => {
        let isSelected = payload.scheduledDaysOfWeek.includes(day.scheduledDay);
        if (isSelected !== day.isSelected) {
          day.isSelected = isSelected;
        }
        return day;
      });

      // Update only the modified scheduled days
      for (let day of updatedScheduledDays) {
        await day.save();
      }
    }
    return communityData;
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occurred: " + error.message);
  }
};
exports.getAllCommunitiesWithDistanceFromBase = async (req, res) => {
  let sortedCommunities = [];
  try {
    let communities = await Community.findAll({include:CommunityServiceSchedule});
    if (!communities || communities.length === 0) {
      return [];
    }
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
        noOfPetStation: community.communityServiceSchedule.noOfPetStation || 0,
        chargePerPetStation : community.communityServiceSchedule.chargePerPetStation || 0 ,
        noOfGarbageBin: community.communityServiceSchedule.noOfGarbageBin || 0,
        chargePerGarbageBin: community.communityServiceSchedule.chargePerGarbageBin || 0 ,
        startingDate: community.communityServiceSchedule.startingDate ,
        frequency: community.communityServiceSchedule.frequency || 0,
        distance: community.distance.toFixed(3),
        isPaused: community.communityServiceSchedule.isPaused,
        isTaxApplicable: community.communityServiceSchedule.isTaxApplicable,
        isFlatRate: community.communityServiceSchedule.isFlatRate,
        flatRateAmount: community.communityServiceSchedule.flatRateAmount,
        serviceName: community.communityServiceSchedule.serviceName,
      };
      return communityData;
    });
    return result;
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occurred: " + error.message);
  }
};

exports.getAllJobOrderByDate = async (params) => {
  let jobquery = {};
  let taskquery = {};
  
  if(params.date && params.date != ""){
    jobquery.date = params.date;
  }else{
    jobquery.date = moment.tz("America/New_York").format('YYYY-MM-DD');
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
    let chargePerTrashBag = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_TRASH_BAG).value;
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
    if (!communities || communities.length === 0) {
      return [];
    }
    sortedCommunities = await CommonService.orderCommunitiesByProximity(JSON.parse(JSON.stringify(communities)));
    const result = sortedCommunities.map(community => {
      let scheduledDaysOfWeek;
      scheduledDaysOfWeek = community.communityServiceSchedule.scheduledDaysOfWeek;
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
        noOfTrashBagReplacement: 0,
        chargePerPetStation: community.communityServiceSchedule.chargePerPetStation,
        chargePerGarbageBin: community.communityServiceSchedule.chargePerGarbageBin,
        chargePerBagRoll: chargePerBagRoll || 0,
        chargePerBinReplacement: chargePerBinReplacement || 0,
        chargePerNewStationInstallment: chargePerNewStationInstallment || 0,
        chargePerHandSanitizer: chargePerHandSanitizer || 0,
        chargePerTrashBag: chargePerTrashBag || 0,
        isBagRollReplaced: false, // Add your first extra property
        isBinReplaced: false, // Add your first extra property
        isHandSanitizerReplaced: false, // Add your first extra property
        isNewStationInstalled: false, // Add your first extra property
        isTrashBagReplaced: false, // Add your first extra property
        totalBagReplacementPrice: 0,
        totalBinReplacementPrice: 0,
        totalStationInstallationPrice: 0,
        totalHandSanitizerPrice: 0,
        totalTrashBagReplacedPrice: 0,
        scheduledDate: community.tasks[0].scheduledDate,
        distance: community.distance.toFixed(3),
        isTaxApplicable: community.communityServiceSchedule.isTaxApplicable,
        isFlatRate: community.communityServiceSchedule.isFlatRate,
        flatRateAmount: community.communityServiceSchedule.flatRateAmount,
        serviceName: community.communityServiceSchedule.serviceName,  
      };
      return communityData;
    });
    return result;
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
  }
};

exports.getCommunityById = async (req, res) => {
  let params = req.query;
  const userTimeZone = req.headers['timezone'] || 'UTC'; // Get timezone from header
  try {
    let community = await Community.findOne({where:{id:params.id},include:{model:CommunityServiceSchedule,include:ScheduledDays}});
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
      noOfPetStation: community.communityServiceSchedule.noOfPetStation,
      chargePerPetStation: community.communityServiceSchedule.chargePerPetStation,
      noOfGarbageBin: community.communityServiceSchedule.noOfGarbageBin,
      chargePerGarbageBin: community.communityServiceSchedule.chargePerGarbageBin,
      startingDate: community.communityServiceSchedule.startingDate,
      scheduledDaysOfWeek: community.communityServiceSchedule.scheduledDays
      .filter(day => day.isSelected)
      .map(day => day.scheduledDay),
      isPaused: community.communityServiceSchedule.isPaused,
      isTaxApplicable: community.communityServiceSchedule.isTaxApplicable,
      isFlatRate: community.communityServiceSchedule.isFlatRate,
      flatRateAmount: community.communityServiceSchedule.flatRateAmount,
      serviceName: community.communityServiceSchedule.serviceName,
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
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occurred: " + error.message);
  }
};

exports.getCommunityByDays = async (req)=>{
  try {
    let scheduledDays = await ScheduledDays.findAll({where:{isSelected:true},include:{model:CommunityServiceSchedule, include:Community}});
    return scheduledDays;
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occurred: " + error.message);
  }
}

