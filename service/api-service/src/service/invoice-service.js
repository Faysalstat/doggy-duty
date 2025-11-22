const path = require("path");
const { sendInvoice } = require("../mail/mailer");
const logger = require("../../logger");
const fs = require("fs/promises"); // 👈 use promise-based fs
exports.generateInvoices = async (params) => {
  try {
    let newService = await Service.create(serviceEntity);
    return newService;
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occured " + error.message);
  }
};
exports.sendMailWithInvoice = async (invoice, file) => {
  try {
    const pdfPath = path.join(__dirname, "../../invoices", `${file.filename}`);
    // Send mail with attachment
    await sendInvoice({
      from: '"My Company" <your_email@gmail.com>',
      to: ["faysalstat04@gmail.com", "woof@doggyduty.pet"],
      subject: "DOGGY DUTY, LLC - INVOICE ",
      text: `Hello ${invoice.name},
Attached to this email is the invoice for ${invoice.name} for pet waste station service.
Please feel free to reach out if you have any questions or need further information.
Best Regards,
Tatiana Anderson, Owner and Founder
Francis Edward, CEO
Doggy Duty, LLC
Email: DoggyDutyPro@gmail.com
Cell: (863) 399-5176
www.DoggyDuty.Pet
"Your Dog's Doody Is Our Duty"`,
      attachments: [
        {
          filename: `invoice_${file.filename}.pdf`,
          path: pdfPath, // 👈 Attach local file directly
          contentType: "application/pdf",
        },
      ],
    });

    logger.info("Invoice sent successfully to faysalstat04@gmail.com!");
    await fs.unlink(pdfPath);
    logger.info(`🗑️ Deleted file: ${pdfPath}`);
  } catch (error) {
    logger.error("Invoice generation failed", { stack: error.stack });
  }
};
