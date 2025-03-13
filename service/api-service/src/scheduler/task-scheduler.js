const taskService = require("../service/task-service");
const communityService = require("../service/community-service");
const sendMail = require("../mail/mailer");
const { TASK_STATUS } = require("../model/enums");
exports.generateDailyTasks = async () => {
  let today = new Date();
//   await taskService.generateDailyTasks({ scheduledDate: today });
  let param = {
    status: TASK_STATUS.PENDING
  }
  let response = await communityService.getAllJobOrderByDate(param);
  const emailBody = generateTaskListEmailBody(response);
//   sendMail("pinnacleserviceboard@gmail.com", "Daily Tasks Generated", emailBody);
//   sendMail("faysalstat04@gmail.com", "Daily Tasks Generated", emailBody);
};

const generateTaskListEmailBody = (tasks) => {
  let emailBody = `
      <h2>Daily Task List</h2>
      <p>Dear Team,</p>
      <p>Please find below the task list for today:</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Community Name</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Address</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Task Status</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Contact Person</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Phone</th>
          </tr>
        </thead>
        <tbody>
    `;

  tasks.forEach((task) => {
    emailBody += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${task.communityName}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${task.communityAddress}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${task.taskStatus}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${task.camOfcommunity}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${task.phone}</td>
        </tr>
      `;
  });

  emailBody += `
        </tbody>
      </table>
      <p>Thank you!</p>
      <p>Best regards,<br>Your Company</p>
    `;

  return emailBody;
};
