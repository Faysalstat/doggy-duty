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
    startingDate:Sequelize.DATE,
    lastServedDate:Sequelize.DATE,
    lastInvoiceGenerated:Sequelize.DATE,
    scheduledDate:Sequelize.STRING,
    noOfPetStation:Sequelize.INTEGER,
    noOfGarbageBin:Sequelize.INTEGER,
    chargePerPetStation:Sequelize.DOUBLE,
    chargePerGarbageBin:Sequelize.DOUBLE,
  },
  {
    freezeTableName: true,
  }
);

module.exports = CommunityServiceSchedule;
