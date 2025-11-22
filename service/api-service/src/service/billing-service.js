const Billing = require("../model/billing");
const Community = require("../model/community");
const Invoice = require("../model/invoice");
const InvoiceBillMapping = require("../model/invoice-bill");
const Task = require("../model/task");
const { Op } = require("sequelize");
const logger = require("../../logger");
const AppConfig = require("../model/app-config");
const { CONFIG_NAMES } = require("../model/enums");
const invoiceservice = require("./invoice-service");
const CommunityServiceSchedule = require("../model/communityServiceSchedule");
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

  let config = await AppConfig.findAll();
  let chargePerBagRoll = config.find(
    (c) => c.configName === CONFIG_NAMES.PRICE_PER_BAG_ROLL
  ).value;
  let chargePerBinReplacement = config.find(
    (c) => c.configName === CONFIG_NAMES.PRICE_PER_BIN_REPLACEMENT
  ).value;
  let chargePerNewStationInstallment = config.find(
    (c) => c.configName === CONFIG_NAMES.PRICE_PER_NEW_STATION_INSTALLMENT
  ).value;
  let chargePerHandSanitizer = config.find(
    (c) => c.configName === CONFIG_NAMES.PRICE_PER_HAND_SANITIZER
  ).value;
  let chargePerTrashBag = config.find(
    (c) => c.configName === CONFIG_NAMES.PRICE_PER_TRASH_BAG
  ).value;
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
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
      ],
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
              include: [Task, {model: Community, include: CommunityServiceSchedule}],
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
        additionalTasks:[],
        totalGarbageBins: invoice.totalGarbageBins,
        totalPetStations: invoice.totalPetStations,
        totalBagReplaced: invoice.totalBagReplaced,
        totalBinReplaced: invoice.totalBinReplaced,
        totalNewInstallment: invoice.totalNewInstallment,
        totalHandSanitizerReplaced: invoice.totalHandSanitizerReplaced,
        totalTrashBagReplaced: invoice.totalTrashBagReplaced,
        costPerGarbageBins: invoice.costPerGarbageBins,
        costPerPetStations: invoice.costPerPetStations,
        costPerBagReplaced: chargePerBagRoll,
        costPerBinReplaced: chargePerBinReplacement,
        costPerNewStationInstalled: chargePerNewStationInstallment,
        costPerHandSanitizer: chargePerHandSanitizer,
        costPerTrashBag: chargePerTrashBag,
        status: invoice.status,
        invoiceDate: invoice.invoiceDate,
        totalAmount:
          invoice.totalGarbageBins * invoice.costPerGarbageBins +
          invoice.totalPetStations * invoice.costPerPetStations +
          invoice.totalBagReplaced * chargePerBagRoll +
          invoice.costPerHandSanitizer * invoice.totalHandSanitizerReplaced +
          invoice.costPerTrashBag * invoice.totalTrashBagReplaced,
      };
      // Extract community details (assuming communities are the same for the invoice)
      const billings = invoice.invoice_bill_mappings
        ?.map((mapping) => {
          return mapping.billing;
        })
        .filter(Boolean); // Remove null/undefined values

      if (billings.length > 0) {
        let bill = billings[0].dataValues;
        invoiceData.isBagRollReplaced = bill.task.isBagRollReplaced;
        invoiceData.community = billings[0].community; // Take the first one since they're all the same
        invoiceData.isTaxApplicable =
          billings[0].community.communityServiceSchedule.isTaxApplicable;
        invoiceData.isFlatRate =
          billings[0].community.communityServiceSchedule.isFlatRate;
        invoiceData.flatRateAmount =
          billings[0].community.communityServiceSchedule.flatRateAmount;
        if (invoiceData.isFlatRate) {
          invoiceData.additionalTasks = billings
            .filter((bill) => bill.task.additionalTask === true)
            .map((bill) => ({
              additionalTask: true,
              serviceName: bill.task.serviceName,
              serviceDate: bill.task.scheduledDate,
              serviceDetails: bill.task.serviceDetails,
              serviceCharge: bill.task.serviceCharge,
              quantity: 1,
            }));
          let totalFlatRateJob = billings.filter(
            (bill) => bill.task.additionalTask === false
          ).length;
          invoiceData.additionalTasks.unshift({
            additionalTask: false,
            serviceName:
              billings[0].community.communityServiceSchedule.serviceName,
            serviceDate: "",
            serviceDetails: "",
            serviceCharge:
              billings[0].community.communityServiceSchedule.flatRateAmount,
            quantity: totalFlatRateJob,
          });
          // Calculate total amount
          invoiceData.totalAmount = invoiceData.additionalTasks.reduce(
            (sum, task) => {
              const charge = Number(task.serviceCharge) || 0;
              // const qty = Number(task.quantity) || 0;
              return sum + charge;
            },
            0
          );
        }
      }
      return invoiceData;
    });
    return formattedInvoices;
  } catch (error) {
    throw new Error("Error Occurred: " + error.message);
  }
};

exports.payInvoice = async (req) => {
  let params = req.body;
  let file = req.file;
  try {
    let invoice = await Invoice.findOne({
      where: { id: params.invoiceId },
      include: [
        {
          model: InvoiceBillMapping,
          required: true,
          include: [
            {
              model: Billing,
              include: [Task, Community],
              required: true,
            },
          ],
        },
      ],
    });
    if (invoice) {
      if (params.status && params.status == "paid") {
        for (let i = 0; i < invoice.invoice_bill_mappings.length; i++) {
          let bill = invoice.invoice_bill_mappings[i].billing;
          await Billing.update({ status: "paid" }, { where: { id: bill.id } });
        }
      } else {
        const invoiceData = {
          invoiceId: invoice.id,
        };
        // Extract community details (assuming communities are the same for the invoice)
        const billings = invoice.invoice_bill_mappings
          ?.map((mapping) => {
            return mapping.billing;
          })
          .filter(Boolean); // Remove null/undefined values

        if (billings.length > 0) {
          let bill = billings[0].dataValues;
          invoiceData.name = billings[0].community.communityName; // Take the first one since they're all the same
          invoiceData.email = billings[0].community.email; // Add email
        }
        await invoiceservice.sendMailWithInvoice(invoiceData, file);
      }
      await Invoice.update(
        { status: params.status },
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
              include: [Task, {model:Community, include: CommunityServiceSchedule}],
            },
          ],
        },
      ],
    });
    for (let index = 0; index < totalPaidBill.length; index++) {
      const invoice = totalPaidBill[index];
      if (invoice.status == "paid") {
        totalAmountGetPaid += invoice.totalAmount;
        // if(invoice.billing.isTaxApplicable)
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

