const Billing = require("../model/billing");
const Community = require("../model/community");
const Invoice = require("../model/invoice");
const InvoiceBillMapping = require("../model/invoice-bill");
const Task = require("../model/task");
const { Op } = require("sequelize");

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
    throw new Error("Error Occurred: " + error.message);
  }
};

exports.getAllInvoices = async (req, res, next) => {
  try {
    let invoices = await Invoice.findAll({
      include: [
        {
          model: InvoiceBillMapping,
          include: [
            {
              model: Billing,include: [Task, Community]
            },
          ],
        },
      ],
    });
    const formattedInvoices = invoices.map(invoiceModel => {
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
        totalAmount: (invoice.totalGarbageBins * invoice.costPerGarbageBins) 
        + (invoice.totalPetStations * invoice.costPerPetStations) 
        + (invoice.totalBagReplaced * invoice.costPerBagReplaced) + (invoice.costPerHandSanitizer * invoice.totalHandSanitizerReplaced),
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
}
exports.payInvoice = async (req, res, next) => {
  let params = req.body;
  try {
    let invoice = await Invoice.findOne({where:{id:params.invoiceId},include: [{model:InvoiceBillMapping,include:Billing}]});
    if (invoice) {
      invoice.status = "paid";
      for (let i = 0; i < invoice.invoice_bill_mappings.length; i++) {
        let bill = invoice.invoice_bill_mappings[i].billing;
        await Billing.update({status:"paid"},{where:{id:bill.id}});
      }
      await Invoice.update({status:"paid"},{where:{id:params.invoiceId}});
      return invoice;
    } else {
      throw new Error("Invoice not found");
    }
  } catch (error) {
    throw new Error("Error Occurred: " + error.message);
  }
}
