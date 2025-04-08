const CommunityServiceSchedule = require("../model/communityServiceSchedule");
const Task = require("../model/task");
const JobOrder = require("../model/job-order");
const Community = require("../model/community");
const { Op } = require("sequelize");
const commonService = require("../service/common-service");
const AppConfig = require("../model/app-config");
const { CONFIG_NAMES, TASK_STATUS, PAYMENT_STATUS } = require("../model/enums");
const Billing = require("../model/billing");
const logger = require("../../logger");
const moment = require("moment-timezone");
// Function to generate job orders and tasks
exports.generateDailyTasks = async (scheduledDate) => {
  try {
    let query = {};
    let taskDate = scheduledDate;
    let currentDay = moment.tz(scheduledDate, "YYYY-MM-DD", "America/New_York").format("dddd");
    query.scheduledDaysOfWeek =  {[Op.like]: `%${currentDay}%`};
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
      logger.info("Job Execution Log", {
            job_name: "Job Scheduler",
            job_type: "Scheduler",
            status: "Scheduler Stopped",
            error_message: `No scheduled services for today`,
          });
      return [];
    }

    let jobOrders = [];
    let currentTasks = [];

    // Sort communities by distance (assume each community has a distance field)
    let sortedSchedule = await commonService.getSortedScheduledListByDistance(
      schedules
    );

    for (const schedule of sortedSchedule) {
      
      const communitySchedule = schedule.dataValues;
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
    logger.info("Job Execution Log", {
      job_name: "Job Scheduler",
      job_type: "Scheduler",
      status: "Scheduler Completed",
    });
    return schedules;
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
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
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack
    });
    throw new Error("Error Occured " + error.message);
  }
};

exports.completeTask = async (req, res) => {
  let payload = req.body;
  try {
    let task = await Task.findOne({
      where: { id: payload.taskId },
      include: [{ model: Community, include: CommunityServiceSchedule }],
    });

    let scheduleUpdateModel = {
      lastServedDate: task.scheduledDate,
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
      logger.info("Job Execution Log", {
        job_name: "Task Completion",
        job_type: "Task Completion",    
        status: "Task Cancelled",
      });
      return "Task Cancelled";
    }
    let totalBill = await calculateTotalBill(task,payload);
    let billModel = {
      totalAmount: totalBill,
      taskCompletionDate: task.scheduledDate,
      status: PAYMENT_STATUS.PENDING,
      communityId: task.communityId,
      taskId: task.id,
      invoiceGenerated: false,
    };
    let createdBill = await Billing.create(billModel);
    return createdBill;
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
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

const setToMidnightUTC = async (date) => {
  if (!date) return null;
  let dt = new Date(date);
  dt.setUTCHours(18, 0, 0, 0); // Set to 00:00:00 UTC
  return dt;
};
