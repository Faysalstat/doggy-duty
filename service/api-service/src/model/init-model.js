const db = require("../connector/db-connector");
const User = require("./user");
const Community = require("./community");
const Service = require("./service");
const CommunityServiceSchedule = require("./communityServiceSchedule");
const JobOrder = require("./job-order");
const Task = require("./task");
const Billing = require("./billing");
const AppConfig = require("./app-config");

// Define Relationships
Community.hasOne(CommunityServiceSchedule);
CommunityServiceSchedule.belongsTo(Community);

Task.belongsTo(JobOrder);
Task.belongsTo(Community);

JobOrder.hasMany(Task);
Community.hasOne(Task);

Billing.belongsTo(Community);
Community.hasMany(Billing);

db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized.");
});

module.exports = {
  User,
  Community,
  Service,
  CommunityServiceSchedule,
  JobOrder,
  Task,
  Billing,
  AppConfig
};
