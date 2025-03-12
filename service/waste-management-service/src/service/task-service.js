const CommunityServiceSchedule = require("../model/communityServiceSchedule");
const Task = require("../model/task");
const JobOrder = require("../model/job-order");
const Community = require("../model/community");
const Service = require("../model/service");
const commonService = require("../service/common-service");

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
      include: [{ model: Community }, { model: Service }],
    });

    if (schedules.length === 0) {
      console.log("No scheduled services for today.");
      return;
    }

    let jobOrders = [];
    let currentTasks = [];

    // Sort communities by distance (assume each community has a distance field)
    let sortedSchedule = commonService.getSortedScheduledListByDistance(schedules);

    for (const schedule of sortedSchedule) {
      const { communityId, serviceId } = schedule.dataValues;

      let task = {
        communityId,
        serviceId,
        scheduledDate: new Date(),
        status: "pending",
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
