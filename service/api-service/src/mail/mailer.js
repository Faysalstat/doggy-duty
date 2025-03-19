require("dotenv").config();
const nodemailer = require("nodemailer");

// Create a transporter object using your mail server details
// const transporter = nodemailer.createTransport({
//   host: 'mail.exeyezone.com',
//   port: 465, // Port 465 is typically used for secure SMTP
//   secure: true, // Set to true for port 465
//   auth: {
//     user: 'doggy.duty@exeyezone.com', // Your email address
//     pass: '?E}c;$}GL.bZ', // Your email password
//   },
// });

const transporter = nodemailer.createTransport({
  host: 'doggyduty.live',
  port: 465, // Port 465 is typically used for secure SMTP
  secure: true, // Set to true for port 465
  auth: {
    user: 'task.scheduler@doggyduty.live', // Your email address
    pass: '5@~JR0?du]EA', // Your email password
  },
});


/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Email body text
 */
const sendMail = async (to, subject, html) => {
    try {
      const info = await transporter.sendMail({
        from: `"New Dog Task" <${transporter.options.auth.user}>`,
        to,
        subject,
        html, // Send HTML content
      });
  
      console.log("Email sent: ", info.messageId);
      return {
        isSuccess:true,
        info: info
      };
    } catch (error) {
      console.error("Error sending email:", error);
      return 
    }
  };

module.exports = sendMail;
