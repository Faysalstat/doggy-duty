const db = require("../connector/db-connector");
const User = require("./user");
const Community = require("./community");
const Service = require("./service");
const CommunityServiceSchedule = require("./communityServiceSchedule");
const JobOrder = require("./job-order");
const Task = require("./task");
const Billing = require("./billing");
const AppConfig = require("./app-config");
const SchedulerLog = require("./scheduler-log");
const Invoice = require("./invoice");
const InvoiceBillMapping = require("./invoice-bill");
// Define Relationships
Community.hasOne(CommunityServiceSchedule);
CommunityServiceSchedule.belongsTo(Community);

Task.belongsTo(JobOrder);
Task.belongsTo(Community);

JobOrder.hasMany(Task);
Community.hasMany(Task);

Billing.belongsTo(Community);
Community.hasMany(Billing);

Billing.belongsTo(Task);
Task.hasOne(Billing);

// Associations
InvoiceBillMapping.belongsTo(Invoice);
InvoiceBillMapping.belongsTo(Billing);

Invoice.hasMany(InvoiceBillMapping);
Billing.hasMany(InvoiceBillMapping);
module.exports = {
  User,
  Community,
  Service,
  CommunityServiceSchedule,
  JobOrder,
  Task,
  Billing,
  AppConfig,
  SchedulerLog
};
