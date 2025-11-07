const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
// Transporter 1: Business domain (for System emails)
const transporter = nodemailer.createTransport({
  host: 'doggyduty.live',
  port: 465, // Port 465 is typically used for secure SMTP
  secure: true, // Set to true for port 465
  auth: {
    user: 'task.scheduler@doggyduty.live', // Your email address
    pass: '5@~JR0?du]EA', // Your email password
  },
});

// Transporter 2: Personal domain (for customer emails)
const personalTransporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
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

const sendInvoice = async(model)=>{
  try {
      model.from =  `"Invoice Generated" <${personalTransporter.options.auth.user}>`
      const info = await personalTransporter.sendMail(model);
      console.log("Email and invoice sent: ", info.messageId);
      return {
        isSuccess:true,
        info: info
      };
    } catch (error) {
      console.error("Error sending email:", error);
      return 
    }
}
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ General Mail Transport Error:", error);
  } else {
    console.log("✅ General Mail Transport Ready");
  }
});
personalTransporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Personal Mail Transport Error:", error);
  } else {
    console.log("✅ Personal Mail Transport Ready");
  }
});
module.exports = {sendMail,sendInvoice};
