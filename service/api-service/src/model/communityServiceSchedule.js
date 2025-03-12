const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const CommunityServiceSchedule = db.sequelize.define(
  "communityServiceSchedules",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    frequency:Sequelize.INTEGER,
    startingDate:Sequelize.DATEONLY,
    lastServedDate:Sequelize.DATEONLY,
    scheduledDate:Sequelize.DATEONLY
  },
  {
    freezeTableName: true,
  }
);

module.exports = CommunityServiceSchedule;
