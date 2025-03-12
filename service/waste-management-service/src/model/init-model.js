const db = require("../connector/db-connector");
const User = require("./user");
const Community = require("./community");
const Service = require("./service");
const CommunityServiceSchedule = require("./communityServiceSchedule");
const JobOrder = require("./job-order");
const Task = require("./task");
const Billing = require("./billing");

// Define Relationships
Community.hasMany(CommunityServiceSchedule);
CommunityServiceSchedule.belongsTo(Community);
CommunityServiceSchedule.belongsTo(Service);

Task.belongsTo(JobOrder);
Task.belongsTo(Community);
Task.belongsTo(Service);

JobOrder.hasMany(Task);
Community.hasMany(Task);
Service.hasMany(Task);

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
};
