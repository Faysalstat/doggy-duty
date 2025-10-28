const { Op } = require("sequelize");
const logger = require("../../logger");
const {sendmMail,sendInvoice} = require("../mail/mailer");
const puppeteer = require("puppeteer");
exports.generateInvoices = async (params) => {
  try {
    let newService = await Service.create(serviceEntity);
    return newService
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occured " + error.message);
  }
};
exports.designInvoice = async (invoice) => {
  try {
    const invoiceHTML = generateInvoiceHTML(invoice);

    // Generate PDF with Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(invoiceHTML, { waitUntil: "load" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    // Send mail with attachment
    await sendInvoice({
      from: '"My Company" <your_email@gmail.com>',
      to: "pinnacleserviceboard@gmail.com",
      subject: "DOGGY DUTY, LLC - INVOICE ",
      text: `
      Hello ${invoice.name}
      Attached to this email is the invoice for ${invoice.name} for pet waste station service. Please feel free to reach out if you have any questions or need further information.`,
      attachments: [
        {
          filename: `invoice_${invoice.invoiceId}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    logger.info("Invoice sent successfully to faysalstat04@gmail.com!");
  } catch (error) {
    logger.error("Invoice generation failed", { stack: error.stack });
  }
};


generateInvoiceHTML = (invoice) => {
  return `
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; margin: 30px; }
      .header { display: flex; justify-content: space-between; }
      .logo { font-size: 24px; font-weight: bold; color: #e44; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      table, th, td { border: 1px solid #ddd; }
      th { background: #333; color: #fff; padding: 8px; text-align: left; }
      td { padding: 8px; }
      .total { text-align: right; margin-top: 20px; font-size: 18px; }
      .amount { font-size: 24px; color: blue; }
    </style>
  </head>
  <body>
    <div class="header">
      <div><img src="http://localhost:3000/api/images/logo.png" height="60"/></div>
      <div>
        ${invoice.name}<br/>
        ${invoice.address}<br/>
        Phone: ${invoice.phone}<br/>
        Email: ${invoice.email}
      </div>
    </div>
    <hr/>
    <p><b>Reference:</b> #${invoice.invoiceId}<br/>
    <b>Date:</b> ${invoice.invoiceDate}</p>

    <h3>Services</h3>
    <table>
      <tr>
        <th>Name of the Service</th>
        <th>Rate</th>
        <th>Quantity</th>
        <th>Amount</th>
      </tr>
      ${invoice.items
        .map(
          (item) => `
        <tr>
          <td>${item.name}</td>
          <td>$${item.rate}</td>
          <td>${item.qty}</td>
          <td>$${item.amount.toFixed(2)}</td>
        </tr>`
        )
        .join("")}
      <tr>
        <td colspan="3"><b>Tax</b></td>
        <td>$${invoice.tax.toFixed(2)}</td>
      </tr>
    </table>

    <div class="total">
      <p>Amount due:</p>
      <p class="amount">$${invoice.total.toFixed(2)}</p>
      <p>Status: PENDING</p>
    </div>
  </body>
  </html>
  `;
};


// Dummy invoice data (later fetch from DB)
const dummyInvoice = {
  invoiceId: "INV1",
  date: "2025-04-28",
  customer: {
    name: "Stepping Stone",
    address: "64 Citrine Lp. Kissimmee, FL 34758",
    phone: "(407)-600-2518",
    email: "kendrasoto84@gmail.com",
  },
  items: [
    { name: "Service of Pet Waste Station", rate: 25, qty: 40, amount: 1000 },
    { name: "Garbage Bins", rate: 25, qty: 4, amount: 100 },
    { name: "Replacement of 10 Gal. Bin", rate: 150, qty: 0, amount: 0 },
    { name: "Hand Sanitizer Bottle Refill", rate: 2.5, qty: 0, amount: 0 },
    {
      name: "Pet Waste Station Dispenser Bag Refills (200 rolls)",
      rate: 8.5,
      qty: 7,
      amount: 59.5,
    },
    { name: "40 Gal Trash Bag", rate: 0.5, qty: 0, amount: 0 },
  ],
  tax: 81.17,
  total: 1240.66,
  status: "paid",
};

