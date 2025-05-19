const Billing = require("../model/billing");
const Community = require("../model/community");
const Invoice = require("../model/invoice");
const InvoiceBillMapping = require("../model/invoice-bill");
const Task = require("../model/task");
const { Op } = require("sequelize");
const logger = require("../../logger");
exports.getBillByCommunityId = async (req, res, next) => {
  let params = req.query;
  let query = {};
  let startDate = new Date("2025-03-01");
  let endDate = new Date();
  try {
    if (params.communityId && params.communityId != "") {
      query.communityId = params.communityId;
    }

    if (params.status && params.status != "") {
      query.status = params.status;
    }
    if (params.endDate || params.endDate != "") {
      endDate = new Date(params.endDate);
    }
    if (params.startDate || params.startDate != "") {
      startDate = new Date(params.startDate);
    }
    query.taskCompletionDate = { [Op.between]: [startDate, endDate] };
    let response = await Billing.findAll({
      where: query,
      include: { model: Task, include: Community },
    });
    return response;
  } catch (error) {
    logger.error(error.message);
    throw new Error("Error Occurred: " + error.message);
  }
};

exports.getAllInvoices = async (req, res, next) => {
  let params = req.query;
  let query = {};
  let billingQuery = {};
  let startDate = new Date("2025-03-01");
  try {
    if (params.communityId && params.communityId != "") {
      billingQuery.communityId = params.communityId;
    }
    if (params.status && params.status != "") {
      query.status = params.status;
    }
    if (params.startDate || params.startDate != "") {
      startDate = new Date(params.startDate);
    }
    if (params.endDate || params.endDate != "") {
      endDate = new Date(params.endDate);
    }
    query.invoiceDate = { 
      [Op.between]: [
        startDate.toISOString().split('T')[0], 
        endDate.toISOString().split('T')[0]
      ] 
    };
    let invoices = await Invoice.findAll({
      where: query,
      include: [
        {
          model: InvoiceBillMapping,
          required: true,
          include: [
            {
              model: Billing,
              where: billingQuery, // Filter Billing by communityId = 1
              include: [Task, Community],
              required: true,
            },
          ],
        },
      ],
    });
    const formattedInvoices = invoices.map((invoiceModel) => {
      let invoice = invoiceModel.dataValues;
      // Extract required properties
      const invoiceData = {
        id: invoice.id,
        totalAmount: invoice.totalAmount,
        totalGarbageBins: invoice.totalGarbageBins,
        totalPetStations: invoice.totalPetStations,
        totalBagReplaced: invoice.totalBagReplaced,
        totalBinReplaced: invoice.totalBinReplaced,
        totalNewInstallment: invoice.totalNewInstallment,
        totalHandSanitizerReplaced: invoice.totalHandSanitizerReplaced,
        costPerGarbageBins: invoice.costPerGarbageBins,
        costPerPetStations: invoice.costPerPetStations,
        costPerBagReplaced: invoice.costPerBagReplaced,
        costPerBinReplaced: invoice.costPerBinReplaced,
        costPerNewStationInstalled: invoice.costPerNewStationInstalled,
        costPerHandSanitizer: invoice.costPerHandSanitizer,
        status: invoice.status,
        invoiceDate: invoice.invoiceDate,
        totalAmount:
          invoice.totalGarbageBins * invoice.costPerGarbageBins +
          invoice.totalPetStations * invoice.costPerPetStations +
          invoice.totalBagReplaced * invoice.costPerBagReplaced +
          invoice.costPerHandSanitizer * invoice.totalHandSanitizerReplaced,
      };
      // Extract community details (assuming communities are the same for the invoice)
      const billings = invoice.invoice_bill_mappings
        ?.map((mapping) => {
          console.log(mapping);
          return mapping.billing;
        })
        .filter(Boolean); // Remove null/undefined values

      if (billings.length > 0) {
        let bill = billings[0].dataValues;
        invoiceData.isBagRollReplaced = bill.task.isBagRollReplaced;
        invoiceData.community = billings[0].community; // Take the first one since they're all the same
      }
      return invoiceData;
    });
    return formattedInvoices;
  } catch (error) {
    throw new Error("Error Occurred: " + error.message);
  }
};
exports.payInvoice = async (req, res, next) => {
  let params = req.body;
  try {
    let invoice = await Invoice.findOne({
      where: { id: params.invoiceId },
      include: [{ model: InvoiceBillMapping, include: Billing }],
    });
    if (invoice) {
      invoice.status = "paid";
      for (let i = 0; i < invoice.invoice_bill_mappings.length; i++) {
        let bill = invoice.invoice_bill_mappings[i].billing;
        await Billing.update({ status: "paid" }, { where: { id: bill.id } });
      }
      await Invoice.update(
        { status: "paid" },
        { where: { id: params.invoiceId } }
      );
      return invoice;
    } else {
      throw new Error("Invoice not found");
    }
  } catch (error) {
    throw new Error("Error Occurred: " + error.message);
  }
};
exports.getSumamry = async (req) => {
  let params = req.query;
  let totalEarning = 0;
  let totalAmountGetPaid = 0;
  let totalAmountDue = 0;
  let totalTaxCollected = 0;
  try {
    let year = params.selectedYear || new Date().getFullYear(); // Default to the current year if no year is specified
    let startDate = new Date(`${year}-01-01`);
    let endDate = new Date(`${year}-12-31`);
    let totalPaidBill = await Invoice.findAll({
      where: {
        invoiceDate: { [Op.between]: [startDate, endDate] },
      },
      include: [
        {
          model: InvoiceBillMapping,
          include: [
            {
              model: Billing,
              include: [Task, Community],
            },
          ],
        },
      ],
    });
    for (let index = 0; index < totalPaidBill.length; index++) {
      const invoice = totalPaidBill[index];
      if (invoice.status == "paid") {
        totalAmountGetPaid += invoice.totalAmount;
      }
    }
    totalEarning = totalPaidBill.reduce((sum, invoice) => {
      console.log();
      return sum + invoice.totalAmount;
    }, 0);
    totalTaxCollected = (totalAmountGetPaid * 0.07).toFixed(2);
    return {
      totalEarning,
      totalAmountGetPaid,
      totalTaxCollected,
    };
  } catch (error) {
    throw new Error("Total Amount paid fetch failed");
  }
};
