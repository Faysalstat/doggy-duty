const CommunityServiceSchedule = require("../model/communityServiceSchedule");
const JobOrder = require("../model/job-order");
const Community = require("../model/community");
const { Op } = require("sequelize");
const commonService = require("../service/common-service");
const AppConfig = require("../model/app-config");
const { CONFIG_NAMES, TASK_STATUS, PAYMENT_STATUS } = require("../model/enums");
const Billing = require("../model/billing");
const logger = require("../../logger");
const ScheduledDays = require("../model/scheduled-days");
const { sequelize } = require("../connector/db-connector");
const Task = require("../model/task");
// Function to generate job orders and tasks
exports.generateDailyTasks = async (taskDate,currentDay) => {
  try {
    let query = {};
    let schedulequery = {};
    let tasksForEmail = [];
  
    schedulequery.scheduledDay =  {[Op.like]: `%${currentDay}%`};
    schedulequery.isSelected =  true;
    query.isPaused = false;
    let config = await AppConfig.findAll();
    let chargePerBagRoll = (config.find(c => c.configName  === CONFIG_NAMES.PRICE_PER_BAG_ROLL) || {}).value || 0;
    let chargePerBinReplacement = (config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_BIN_REPLACEMENT) || {}).value || 0;
    let chargePerNewStationInstallment = (config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_NEW_STATION_INSTALLMENT) || {}).value || 0;
    let chargePerHandSanitizer = (config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_HAND_SANITIZER) || {}).value || 0;
    let chargePerTrashBag = (config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_TRASH_BAG) || {}).value || 0;
    // Fetch schedules matching today's day
    const schedules = await CommunityServiceSchedule.findAll({
      where: query,
      include: [
        { model: Community },
        {
          model: ScheduledDays, 
          where: schedulequery
        },
      ],
    });
    if (schedules && schedules.length === 0) {
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
    let filteredCommunityByFrequency = await commonService.getFilteredCommunityBasedOnFrequency(taskDate,schedules);
    if (filteredCommunityByFrequency && filteredCommunityByFrequency.length === 0) {
      logger.info("Job Execution Log", {
            job_name: "Job Scheduler",
            job_type: "Scheduler",
            status: "Scheduler Stopped",
            error_message: `No scheduled services for This Week`,
          });
      return [];
    }
    // Sort communities by distance (assume each community has a distance field)
    let sortedSchedule = await commonService.getSortedScheduledListByDistance(
      filteredCommunityByFrequency
    );

    for (const schedule of sortedSchedule) {
      const communitySchedule = schedule.dataValues;
      let task = {
        communityId: communitySchedule.communityId,
        scheduledDate: taskDate,
        status: "pending",
        additionalTask: false,
        serviceName: communitySchedule.serviceName,
        serviceCharge: 0,
        serviceDetails: "",
        isBagRollReplaced: false,
        isBinReplaced: false,
        isNewStationInstalled: false,
        isHandSanitizerReplaced: false,
        isTrashBagReplaced: false,
        noOfPetStation: communitySchedule.noOfPetStation,
        noOfGarbageBin: communitySchedule.noOfGarbageBin,
        noOfBagRollReplaced: 0,
        noOfBinReplacement: 0,
        noOfStationInstalled: 0,
        noOfHandSanitizerReplacement: 0,
        noOfTrashBagReplacement: 0,
        chargePerPetStation: communitySchedule.chargePerPetStation,
        chargePerGarbageBin: communitySchedule.chargePerGarbageBin,
        chargePerBagRoll: chargePerBagRoll,
        chargePerBinReplacement: chargePerBinReplacement,
        chargePerNewStationInstallment: chargePerNewStationInstallment,
        chargePerHandSanitizer: chargePerHandSanitizer,
        chargePerTrashBag: chargePerTrashBag,
      };
      currentTasks.push(task);
      tasksForEmail.push({
        communityName: communitySchedule.community.communityName,
        communityAddress: communitySchedule.community.communityAddress,
        camOfcommunity: communitySchedule.community.camOfcommunity,
        phone: communitySchedule.community.phone,
        noOfGarbageBin: communitySchedule.noOfGarbageBin,
        noOfPetStation: communitySchedule.noOfPetStation,
        taskStatus: "Pending",
      });
    }
    // Create remaining tasks if any
    if (currentTasks.length > 0) {
      let jobOrder = await JobOrder.create({ date: taskDate });
      if (!jobOrder) {
        logger.error("Failed to create job order");
        return [];
      }
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
    return tasksForEmail;
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    return [];
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
      include: [{model:Community, include: CommunityServiceSchedule}, JobOrder],
      order: [[Task.sequelize.fn('STR_TO_DATE', Task.sequelize.col('scheduledDate'), '%m-%d-%Y'), 'DESC']],
    });
    let taskList = JSON.parse(JSON.stringify(tasks));
    const result = taskList.map((task) => {
      const taskModel = {
        additionalTask: task.additionalTask,
        serviceName: task.serviceName,
        serviceCharge: task.serviceCharge,
        serviceDetails: task.serviceDetails,
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
        noOfBagRollReplaced: task.noOfBagRollReplaced,
        noOfBinReplacement: task.noOfBinReplacement,
        noOfHandSanitizerReplacement: task.noOfHandSanitizerReplacement,
        noOfStationInstalled: task.noOfStationInstalled,
        noOfTrashBagReplacement: task.noOfTrashBagReplacement,
        chargePerGarbageBin: task.chargePerGarbageBin,
        chargePerBagRoll: task.chargePerBagRoll,
        chargePerBinReplacement: task.chargePerBinReplacement,
        chargePerHandSanitizer: task.chargePerHandSanitizer,
        chargePerNewStationInstallment: task.chargePerNewStationInstallment,
        chargePerTrashBag: task.chargePerTrashBag,
        scheduledDate: task.scheduledDate,
        taskId: task.id,
        taskStatus: task.status,
        isFlatRate: task.community.communityServiceSchedule.isFlatRate,
        flatRateAmount: task.community.communityServiceSchedule.flatRateAmount,
        serviceName: task.community.communityServiceSchedule.serviceName,
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
      isTrashBagReplaced: payload.isTrashBagReplaced,
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
      noOfTrashBagReplacement: payload.noOfTrashBagReplacement
        ? payload.noOfTrashBagReplacement
        : 0,
      chargePerBagRoll: payload.chargePerBagRoll,
      chargePerBinReplacement: payload.chargePerBinReplacement,
      chargePerNewStationInstallment: payload.chargePerNewStationInstallment,
      chargePerHandSanitizer: payload.chargePerHandSanitizer,
      chargePerTrashBag: payload.chargePerTrashBag,
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
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
      error: error.message
    });
  }
};

const calculateTotalBill = async (task,payload) => {
  let config = await AppConfig.findAll();
  let chargePerBagRoll = config.find(c => c.configName  === CONFIG_NAMES.PRICE_PER_BAG_ROLL).value;
  let chargePerBinReplacement = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_BIN_REPLACEMENT).value;
  let chargePerNewStationInstallment = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_NEW_STATION_INSTALLMENT).value;
  let chargePerHandSanitizer = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_HAND_SANITIZER).value;
  let chargePerTrashBag = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_TRASH_BAG).value;
  const petStationCost = task.noOfPetStation * task.chargePerPetStation;
  const garbageBinCost = task.noOfGarbageBin * task.chargePerGarbageBin;
  const bagRollCost = payload.noOfBagRollReplaced * chargePerBagRoll;
  const binReplacementCost = payload.noOfBinReplacement * chargePerBinReplacement;
  const petStationInstallmentCost = payload.noOfStationInstalled * chargePerNewStationInstallment;
  const handSanitizerCost = payload.noOfHandSanitizerReplacement * chargePerHandSanitizer;
  const trashBagCost = payload.noOfTrashBagReplacement * chargePerTrashBag;
  return petStationCost + garbageBinCost + bagRollCost + binReplacementCost + petStationInstallmentCost + handSanitizerCost + trashBagCost;
};

exports.addAdditionalTask = async (req, res) => {
  const payload = req.body;

  if (!payload?.communityId || !Array.isArray(payload.additionalJobs)) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const t = await sequelize.transaction();

  try {
    const { communityId, additionalJobs } = payload;

    for (const additionalJob of additionalJobs) {
      // Validate each job entry
      if (!additionalJob.taskDate || !additionalJob.serviceName || !additionalJob.serviceCharge) {
        throw new Error("Missing required fields in additional job");
      }

      // 1️⃣ Create the task
      const taskModel = {
        communityId,
        scheduledDate: additionalJob.taskDate,
        status: "completed",
        additionalTask: true, // mark as additional
        serviceName: additionalJob.serviceName,
        serviceCharge: additionalJob.serviceCharge,
        serviceDetails: additionalJob.serviceDetails || "",
        isBagRollReplaced: false,
        isBinReplaced: false,
        isNewStationInstalled: false,
        isHandSanitizerReplaced: false,
        isTrashBagReplaced: false,
        noOfPetStation: 0,
        noOfGarbageBin: 0,
        noOfBagRollReplaced: 0,
        noOfBinReplacement: 0,
        noOfStationInstalled: 0,
        noOfHandSanitizerReplacement: 0,
        noOfTrashBagReplacement: 0,
        chargePerPetStation: 0,
        chargePerGarbageBin: 0,
        chargePerBagRoll: 0,
        chargePerBinReplacement: 0,
        chargePerNewStationInstallment: 0,
        chargePerHandSanitizer: 0,
        chargePerTrashBag: 0,
      };

      const createdTask = await Task.create(taskModel, { transaction: t });

      // 2️⃣ Create the bill entry
      const billModel = {
        totalAmount: additionalJob.serviceCharge,
        taskCompletionDate: additionalJob.taskDate,
        status: PAYMENT_STATUS.PENDING,
        communityId,
        taskId: createdTask.id,
        invoiceGenerated: false,
      };

      await Billing.create(billModel, { transaction: t });
    }

    // 3️⃣ Commit transaction
    await t.commit();
    return { message: "Additional tasks added successfully" };

  } catch (error) {
    await t.rollback();
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error(`Error occurred: ${error.message}`, { stack: error.stack });
  }
};


