const taskService = require("../service/task-service");
const communityService = require("../service/community-service");
const sendMail = require("../mail/mailer");
const { TASK_STATUS } = require("../model/enums");
const Community = require("../model/community");
const SchedulerLog = require("../model/scheduler-log");
const smsService = require("../service/smsService");
const Billing = require("../model/billing");
const Task = require("../model/task");
const CommunityServiceSchedule = require("../model/communityServiceSchedule");
const Invoice = require("../model/invoice");
const InvoiceBillMapping = require("../model/invoice-bill");
const moment = require("moment-timezone");
const logger = require("../../logger");
exports.generateDailyTasks = async (today) => {
  try {
    
    let taskScheduled = await taskService.generateDailyTasks(today);
    let response = await communityService.getAllJobOrderByDate(
      {
        status: TASK_STATUS.PENDING,
      },
      null
    );

    if (response.length && response.length > 0) {
      
      await generateMail(today, response);
      logger.info("Job Execution Log", {
        job_name: "Job Scheduler",
        job_type: "SMS & Mail",
        status: SUCCESS, // SUCCESS or FAILURE
        message: `SMS & Mail Sent for ${today}`,
      });
    } else {
      logger.info("Job Execution Log", {
        job_name: "Job Scheduler",
        job_type: "SMS & Mail",
        status: `FAILURE`,
        error_message: `SMS & Mail Not Sent for ${today}`,
      });
    }
    await generateInvoice();
    return "SUCCESS"
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Job Generation Failed." + error.message);
  }
};
const sendSMS = async (today) => {
  try {
    const smsResponse = await smsService.sendSms();
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("SMS Sending Failed.Error:" + error.message);
  }
};

const generateMail = async (today, response) => {
  try {
    const emailBody = generateTaskListEmailBody(response);
    sendMail("doggydutypro@gmail.com", "Daily Tasks Generated", emailBody);
    sendMail("woof@doggyduty.pet", "Daily Tasks Generated", emailBody);
    sendMail("faysalstat04@gmail.com", "Daily Tasks Generated", emailBody);
    logger.info(`Mail sent successfully`);
    const smsResponse = await smsService.sendSms();
    logger.info(`SMS sent successfully`);
    console.log("SMS Response: ", smsResponse);
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error(`Mail Sending Failed on ${today}` + error.message);
  }
};
const generateInvoice = async () => {
  try {
    let communities = await Community.findAll({
      include: [{ model: CommunityServiceSchedule }],
    });
    for (let i = 0; i < communities.length; i++) {
      let community = communities[i].dataValues;
      // Proper logging of community details
      logger.info(`Processing community: ${community.communityName}`, community);
      if (community.communityServiceSchedule?.lastInvoiceGenerated) {
        const lastGenerated = moment(
          community.communityServiceSchedule.lastInvoiceGenerated
        );
        const today = moment().startOf("day"); // Start of today
        logger.info("Job Execution Log", {
          job_name: "Job Scheduler",
          job_type: "Invoice Generation",
          status: "INFO",
          error_message: `Days since last invoice generated for ${community.communityName} : ${today.diff(
            lastGenerated,
            "days"
          )}`,
        });
        if (today.diff(lastGenerated, "days") >= 1) {
          logger.info(`Generating invoice for community: ${community.communityName}`);
          let invoiceModel = {
            totalAmount: 0,
            totalGarbageBins: 0,
            totalPetStations: 0,
            totalBagReplaced: 0,
            totalBinReplaced: 0,
            totalHandSanitizerReplaced: 0,
            totalNewInstallment: 0,
            costPerGarbageBins: 0,
            costPerPetStations: 0,
            costPerBagReplaced: 0,
            costPerBinReplaced: 0,
            costPerNewStationInstalled: 0,
            invoiceDate: today.toDate(),
          };
          let bills = await Billing.findAll({
            where: { invoiceGenerated: false, communityId: community.id },
            include: [{ model: Task, include: Community }],
          });
          if (bills && bills.length > 0) {
            for (let j = 0; j < bills.length; j++) {
              let bill = bills[j].dataValues;
              invoiceModel.totalGarbageBins += bill.task.noOfGarbageBin;
              invoiceModel.totalPetStations += bill.task.noOfPetStation;
              invoiceModel.totalBagReplaced += bill.task.noOfBagRollReplaced;
              invoiceModel.totalBinReplaced += bill.task.noOfBinReplacement;
              invoiceModel.totalNewInstallment +=
                bill.task.noOfStationInstalled;
              invoiceModel.totalHandSanitizerReplaced +=
                bill.task.noOfHandSanitizerReplacement;
              invoiceModel.totalAmount += bill.totalAmount;
              invoiceModel.costPerGarbageBins = bill.task.chargePerGarbageBin;
              invoiceModel.costPerPetStations = bill.task.chargePerPetStation;
              invoiceModel.costPerBagReplaced = bill.task.chargePerBagRoll;
              invoiceModel.costPerBinReplaced =
                bill.task.chargePerBinReplacement;
              invoiceModel.costPerHandSanitizer =
                bill.task.chargePerHandSanitizer;
              invoiceModel.costPerNewStationInstalled =
                bill.task.chargePerNewStationInstallment;
              await Billing.update(
                { invoiceGenerated: true },
                { where: { id: bill.id } }
              );
            }
            invoiceModel.status = "pending";
            let createdInvoice = await Invoice.create(invoiceModel);
            for (let j = 0; j < bills.length; j++) {
              let bill = bills[j].dataValues;
              let invoiceBillMappingModel = {
                invoiceId: createdInvoice.id,
                billingId: bill.id,
              };
              let createdMapping = await InvoiceBillMapping.create(
                invoiceBillMappingModel
              );
            }
          }

          // Update lastInvoiceGenerated to today
          community.communityServiceSchedule.lastInvoiceGenerated =
            today.toDate();
          await CommunityServiceSchedule.update(
            { lastInvoiceGenerated: today.toDate() },
            { where: { id: community.id } }
          );
        }
      }
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    logger.info("Job Execution Log", {
      job_name: "Job Scheduler",
      job_type: "Invoice Generation",
      status: "FAILED",
      error_message: error.message,
    });
  }
};

const generateTaskListEmailBody = (tasks) => {
  let emailBody = "";
  if (tasks.length && tasks.length > 0) {
    emailBody = `
    <h2>Daily Task List</h2>
    <p>Dear Team,</p>
    <p>Please find below the task list for today:</p>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px;">Community Name</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Address</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Contact Person</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Phone</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Garbage Bin</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Pet Station</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Task Status</th>
        </tr>
      </thead>
      <tbody>
  `;

    tasks.forEach((task) => {
      emailBody += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${task.communityName}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${task.communityAddress}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${task.camOfcommunity}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${task.phone}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${task.noOfGarbageBin}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${task.noOfPetStation}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${task.taskStatus}</td>
      </tr>
    `;
    });

    emailBody += `
      </tbody>
    </table>
    <p>Thank you!</p>
    <p>Best regards,<br>Doggy Duty</p>
  `;
  }
  return emailBody;
};
