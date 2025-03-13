const CommunityServiceSchedule = require("../model/communityServiceSchedule");
const Task = require("../model/task");
const JobOrder = require("../model/job-order");
const Community = require("../model/community");
const Service = require("../model/service");
const commonService = require("../service/common-service");
const AppConfig = require("../model/app-config");
const { CONFIG_NAMES, TASK_STATUS, PAYMENT_STATUS } = require("../model/enums");
const { raw } = require("body-parser");
const Billing = require("../model/billing");

// Function to generate job orders and tasks
exports.generateDailyTasks = async (req,res) => {
  try {
    let params = req.query;
    let query = {};
    if(params.scheduledDate && params.scheduledDate != ""){
      query.scheduledDate = params.scheduledDate;
    }else{
      query.scheduledDate = new Date();
    }

    // Fetch schedules matching today's day
    const schedules = await CommunityServiceSchedule.findAll({
      where: query,
      include: [{ model: Community }],
    });

    if (schedules.length === 0) {
      console.log("No scheduled services for today.");
      return "No scheduled services for today.";
    }

    let jobOrders = [];
    let currentTasks = [];

    // Sort communities by distance (assume each community has a distance field)
    let sortedSchedule = commonService.getSortedScheduledListByDistance(schedules);

    for (const schedule of sortedSchedule) {
      const communitySchedule= schedule.dataValues;
      let task = {
        communityId:communitySchedule.communityId,
        scheduledDate: new Date(),
        status: "pending",
        isBagRollReplaced:false,
        noOfPetStation: communitySchedule.noOfPetStation,
        noOfGarbageBin: communitySchedule.noOfGarbageBin,
        noOfBagRollReplaced: 0,
        chargePerPetStation: communitySchedule.chargePerPetStation,
        chargePerGarbageBin:communitySchedule.chargePerGarbageBin,
        chargePerBagRoll:0,
      };

      currentTasks.push(task);

      // Create a job order for every 4 tasks
      if (currentTasks.length === 4) {
        let jobOrder = await JobOrder.create({date:new Date()});
        for (let task of currentTasks) {
          task.jobOrderId = jobOrder.id;
          await Task.create(task);
        }
        jobOrders.push(jobOrder);
        currentTasks = [];
      }
    }

    // Create remaining tasks if any
    if (currentTasks.length > 0) {
      let jobOrder = await JobOrder.create({date:new Date()});
      for (let task of currentTasks) {
        task.jobOrderId = jobOrder.id;
        await Task.create(task);
      }
      jobOrders.push(jobOrder);
    }

    console.log(`Created ${jobOrders.length} job orders with tasks.`);
    return `Created ${jobOrders.length} job orders with tasks.`;
  } catch (error) {
    console.error("Error in task generation:", error.message);
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    let tasks = Task.findAll({where:{status:'pending'},include:[Community,Service]});
    return tasks;
  } catch (error) {
    throw new Error("Error Occured " + error.message);
  }
};

exports.completeTask = async (req, res) => {
  let payload = req.body;
  try {
    // Get today's date
    //Remove date value after demo
    const today = new Date(payload.date);
    
    // Calculate new scheduled date
    //Remove date value after demo
    const scheduledDate = new Date(payload.date);
    
    let task = await Task.findOne({
      where: { id: payload.taskId },
      include: [{ model: Community, include: CommunityServiceSchedule }],
    });
    let config = await AppConfig.findOne({
      where: { configName: CONFIG_NAMES.PRICE_PER_BAG_ROLL },
    });
    // Parse frequency as a number
    const frequency = Number(task.community.communityServiceSchedule.frequency) || 0;
    scheduledDate.setDate(today.getDate() + frequency); // Add frequency days
    let scheduleUpdateModel = {
      lastServedDate: today,
      scheduledDate: scheduledDate,
    };
    let updatedSchedule = await CommunityServiceSchedule.update(scheduleUpdateModel,{where:{id:task.community.communityServiceSchedule.id}});
    let taskUpdateModel = {
      isBagRollReplaced: payload.isBagRollReplaced,
      status: TASK_STATUS.COMPLETED,
      chargePerBagRoll: config.value,
      noOfBagRollReplaced: payload.isBagRollReplaced
        ? payload.noOfBagRollReplaced
        : 0,
    };
    let updatedTask = await Task.update(taskUpdateModel, {
      where: { id: payload.taskId },
    });
    let totalBill = calculateTotalBill(task);
    let billModel = {
      totalAmount: totalBill,
      taskCompletionDate: new Date(payload.date),
      status: PAYMENT_STATUS.PENDING,
      communityId: task.communityId,
      taskId: task.id,
    };
    let createdBill = await Billing.create(billModel);
    return createdBill;
  } catch (error) {
    throw new Error("Error Occured " + error.message);
  }
};

const calculateTotalBill= (task) => {
  const petStationCost = task.noOfPetStation * task.chargePerPetStation;
  const garbageBinCost = task.noOfGarbageBin * task.chargePerGarbageBin;
  const bagRollCost = task.noOfBagRollReplaced * task.chargePerBagRoll;

  return petStationCost + garbageBinCost + bagRollCost;
}
