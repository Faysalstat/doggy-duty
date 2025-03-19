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
const moment = require("moment");
exports.generateDailyTasks = async () => {
  let today = new Date();
  let smsLog = {};
  let mailLog = {};
  try {
    // await taskService.generateDailyTasks({ scheduledDate: today });
    let param = {
      status: TASK_STATUS.PENDING,
    };
    // await sendSMS();
    // await generateMail();
    await generateInvoice();
  } catch (error) {
    let errorLog = await SchedulerLog.create({
      job_name: "Job Scheduler",
      job_type: "Job Generator",
      status: "FAILED",
      error_message: error.message,
    });
  }
};
const sendSMS = async () => {
  try {
    const smsBody =
      "Doggy Duty, LLC\n\nNew Doggy Duty Work Order Created Today. Please visit www.DoggyDuty.Live to review and print your schedule.\n\nThank you!";
    const smsPayload = {
      messages: [
        {
          body: smsBody,
          to: "+14074174915",
        },
        {
          body: smsBody,
          to: "+18633995176",
        },
      ],
    };
    const { messages } = smsPayload;
    const smsResponse = await smsService.sendSms(messages);
    console.log(smsResponse);
  } catch (error) {
    let errorLog = await SchedulerLog.create({
      job_name: "Job Scheduler",
      job_type: "Mail",
      status: "FAILED",
      error_message: error.message,
    });
    throw new Error("Mail Sending Failed." + error.message);
  }
};

const generateMail = async () => {
  try {
    let response = await communityService.getAllJobOrderByDate(param, null);
    const emailBody = generateTaskListEmailBody(response);
    sendMail("doggydutypro@gmail.com", "Daily Tasks Generated", emailBody);
    sendMail("woof@doggyduty.pet", "Daily Tasks Generated", emailBody);
    sendMail("faysalstat04@gmail.com", "Daily Tasks Generated", emailBody);
  } catch (error) {
    let errorLog = await SchedulerLog.create({
      job_name: "Job Scheduler",
      job_type: "Mail",
      status: "FAILED",
      error_message: error.message,
    });
    throw new Error("Mail Sending Failed." + error.message);
  }
};
const generateInvoice = async () => {
  try {
    let communities = await Community.findAll({
      include: [{ model: CommunityServiceSchedule }],
    });
    for (let i = 0; i < communities.length; i++) {
      let community = communities[i].dataValues;
      console.log(community);
      if (community.communityServiceSchedule?.lastInvoiceGenerated) {
        const lastGenerated = moment(
          community.communityServiceSchedule.lastInvoiceGenerated
        );
        const today = moment().startOf("day"); // Start of today
        console.log(today.diff(lastGenerated, "days"));
        if (today.diff(lastGenerated, "days") >= 7) {
          console.log(`Generating invoice for community: ${community.name}`);
          let invoiceModel = {
            totalAmount: 0,
            totalGarbageBins: 0,
            totalPetStations: 0,
            totalBagReplaced: 0,
            costPerGarbageBins: 0,           
            costPerPetStations: 0,  
            costPerBagReplaced: 0,  
            invoiceDate: today.toDate(),
          };
          let bills = await Billing.findAll({
            where: { invoiceGenerated: false, communityId: community.id },
            include: Task,
          });
          if (bills && bills.length > 0) {
            for (let j = 0; j < bills.length; j++) {
              let bill = bills[j].dataValues;
              invoiceModel.totalGarbageBins += bill.task.noOfGarbageBin;
              invoiceModel.totalPetStations += bill.task.noOfPetStation;
              invoiceModel.totalBagReplaced += bill.task.noOfBagRollReplaced;
              invoiceModel.totalAmount += bill.totalAmount;
              invoiceModel.costPerGarbageBins = bill.task.chargePerGarbageBin;
              invoiceModel.costPerPetStations = bill.task.chargePerPetStation;
              invoiceModel.costPerBagReplaced = bill.task.chargePerBagRoll;
              await Billing.update({ invoiceGenerated: true }, { where: { id: bill.id } });
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
    console.log(error.message);
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
  } else {
    emailBody = `
    <h2>Daily Task List</h2>
    <p>Dear Team,</p>
    <p>No Job Scheduled for today:</p>`;
  }

  return emailBody;
};
