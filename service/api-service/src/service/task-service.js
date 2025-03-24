const CommunityServiceSchedule = require("../model/communityServiceSchedule");
const Task = require("../model/task");
const JobOrder = require("../model/job-order");
const Community = require("../model/community");
const { Op } = require("sequelize");
const commonService = require("../service/common-service");
const AppConfig = require("../model/app-config");
const { CONFIG_NAMES, TASK_STATUS, PAYMENT_STATUS } = require("../model/enums");
const Billing = require("../model/billing");

// Function to generate job orders and tasks
exports.generateDailyTasks = async (params) => {
  try {
    let query = {};
    let taskDate = new Date();
    let nextScheduledDate = new Date();
    if (params.scheduledDate && params.scheduledDate != "") {
      query.scheduledDate = new Date(params.scheduledDate);
      taskDate = new Date(params.scheduledDate);
    }
    let config = await AppConfig.findAll();
    let chargePerBagRoll = config.find(c => c.configName  === CONFIG_NAMES.PRICE_PER_BAG_ROLL).value;
    let chargePerBinReplacement = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_BIN_REPLACEMENT).value;
    let chargePerNewStationInstallment = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_NEW_STATION_INSTALLMENT).value;
    let chargePerHandSanitizer = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_HAND_SANITIZER).value;
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
    let sortedSchedule = await commonService.getSortedScheduledListByDistance(
      schedules
    );

    for (const schedule of sortedSchedule) {
      const communitySchedule = schedule.dataValues;
      const frequency = Number(communitySchedule.frequency) || 0;
      const today = new Date(communitySchedule.scheduledDate);
      nextScheduledDate.setDate(today.getDate() + frequency); // Add frequency days
      let scheduleUpdateModel = {
        scheduledDate: nextScheduledDate,
      };
      let updatedSchedule = await CommunityServiceSchedule.update(
        scheduleUpdateModel,
        { where: { id: communitySchedule.id } }
      );
      let task = {
        communityId: communitySchedule.communityId,
        scheduledDate: taskDate,
        status: "pending",
        isBagRollReplaced: false,
        isBinReplaced: false,
        isNewStationInstalled: false,
        isHandSanitizerReplaced: false,
        noOfPetStation: communitySchedule.noOfPetStation,
        noOfGarbageBin: communitySchedule.noOfGarbageBin,
        noOfBagRollReplaced: 0,
        noOfBinReplacement: 0,
        noOfStationInstalled: 0,
        noOfHandSanitizerReplacement: 0,
        chargePerPetStation: communitySchedule.chargePerPetStation,
        chargePerGarbageBin: communitySchedule.chargePerGarbageBin,
        chargePerBagRoll: chargePerBagRoll,
        chargePerBinReplacement: chargePerBinReplacement,
        chargePerNewStationInstallment: chargePerNewStationInstallment,
        chargePerHandSanitizer: chargePerHandSanitizer,
      };
      currentTasks.push(task);

      // Create a job order for every 4 tasks
      if (currentTasks.length === 4) {
        let jobOrder = await JobOrder.create({ date: taskDate });
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
      let jobOrder = await JobOrder.create({ date: taskDate });
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
  let params = req.query;
  let query = {};
  try {
    if (params.status) {
      const statuses = Array.isArray(params.status)
        ? params.status
        : params.status.split(",");
      query.status = { [Op.in]: statuses };
    }
    let tasks = await Task.findAll({
      where: query,
      include: [Community, JobOrder],
    });
    let taskList = JSON.parse(JSON.stringify(tasks));
    const result = taskList.map((task) => {
      const taskModel = {
        jobOrderId: task.jobOrder?.id, // Get jobOrderId from the first task or set to null
        communityId: task.community.id,
        communityName: task.community.communityName,
        communityAddress: task.community.communityAddress,
        gateCode: task.community.gateCode,
        camOfcommunity: task.community.camOfcommunity,
        phone: task.community.phone,
        email: task.community.email,
        lockBoxCode: task.community.lockBoxCode,
        specialRequest: task.community.specialRequest,
        noOfPetStation: task.noOfPetStation,
        chargePerPetStation: task.chargePerPetStation,
        noOfGarbageBin: task.noOfGarbageBin,
        chargePerGarbageBin: task.chargePerGarbageBin,
        noOfBagRollReplaced: task.noOfBagRollReplaced,
        noOfBinReplacement: task.noOfBinReplacement,
        noOfHandSanitizerReplacement: task.noOfHandSanitizerReplacement,
        noOfStationInstalled: task.noOfStationInstalled,
        chargePerBagRoll: task.chargePerBagRoll,
        chargePerBinReplacement: task.chargePerBinReplacement,
        chargePerHandSanitizer: task.chargePerHandSanitizer,
        chargePerNewStationInstallment: task.chargePerNewStationInstallment,
        scheduledDate: task.scheduledDate,
        taskId: task.id,
        taskStatus: task.status,
      };
      return taskModel;
    });
    return result;
  } catch (error) {
    throw new Error("Error Occured " + error.message);
  }
};

exports.completeTask = async (req, res) => {
  let payload = req.body;
  try {
    // Calculate new scheduled date
    //Remove date value after demo
    const scheduledDate = new Date(payload.date);

    let task = await Task.findOne({
      where: { id: payload.taskId },
      include: [{ model: Community, include: CommunityServiceSchedule }],
    });

    // Parse frequency as a number
    const frequency =
      Number(task.community.communityServiceSchedule.frequency) || 0;
    // Get today's date
    //Remove date value after demo
    const today = new Date(
      task.community.communityServiceSchedule.scheduledDate
    );
    scheduledDate.setDate(today.getDate() + frequency); // Add frequency days
    let scheduleUpdateModel = {
      lastServedDate: today,
      scheduledDate: scheduledDate,
    };
    let updatedSchedule = await CommunityServiceSchedule.update(
      scheduleUpdateModel,
      { where: { id: task.community.communityServiceSchedule.id } }
    );
    let taskUpdateModel = {
      isBagRollReplaced: payload.isBagRollReplaced,
      isBinReplaced: payload.isBinReplaced,
      isNewStationInstalled: payload.isNewStationInstalled,
      isHandSanitizerReplaced: payload.isHandSanitizerReplaced,
      noOfBagRollReplaced: payload.isBagRollReplaced
        ? payload.noOfBagRollReplaced
        : 0,
      noOfBinReplacement: payload.isBinReplaced
        ? payload.noOfBinReplacement
        : 0,
      noOfStationInstalled: payload.isNewStationInstalled
        ? payload.noOfStationInstalled
        : 0,
      noOfHandSanitizerReplacement: payload.isHandSanitizerReplaced
        ? payload.noOfHandSanitizerReplacement
        : 0,
      chargePerBagRoll: payload.chargePerBagRoll,
      chargePerBinReplacement: payload.chargePerBinReplacement,
      chargePerNewStationInstallment: payload.chargePerNewStationInstallment,
      chargePerHandSanitizer: payload.chargePerHandSanitizer,
      status: payload.isCancel ? TASK_STATUS.CANCELED : TASK_STATUS.COMPLETED,
    };
    let updatedTask = await Task.update(taskUpdateModel, {
      where: { id: payload.taskId },
    });
    if (payload.isCancel) {
      return "Task Cancelled";
    }
    let totalBill = await calculateTotalBill(task,payload);
    let billModel = {
      totalAmount: totalBill,
      taskCompletionDate: new Date(payload.date),
      status: PAYMENT_STATUS.PENDING,
      communityId: task.communityId,
      taskId: task.id,
      invoiceGenerated: false,
    };
    let createdBill = await Billing.create(billModel);
    return createdBill;
  } catch (error) {
    throw new Error("Error Occured " + error.message);
  }
};

const calculateTotalBill = async (task,payload) => {
  let config = await AppConfig.findAll();
  let chargePerBagRoll = config.find(c => c.configName  === CONFIG_NAMES.PRICE_PER_BAG_ROLL).value;
  let chargePerBinReplacement = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_BIN_REPLACEMENT).value;
  let chargePerNewStationInstallment = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_NEW_STATION_INSTALLMENT).value;
  let chargePerHandSanitizer = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_HAND_SANITIZER).value;
  const petStationCost = task.noOfPetStation * task.chargePerPetStation;
  const garbageBinCost = task.noOfGarbageBin * task.chargePerGarbageBin;
  const bagRollCost = payload.noOfBagRollReplaced * chargePerBagRoll;
  const binReplacementCost = payload.noOfBinReplacement * chargePerBinReplacement;
  const petStationInstallmentCost = payload.noOfStationInstalled * chargePerNewStationInstallment;
  const handSanitizerCost = payload.noOfHandSanitizerReplacement * chargePerHandSanitizer;
  return petStationCost + garbageBinCost + bagRollCost + binReplacementCost + petStationInstallmentCost + handSanitizerCost;
};
