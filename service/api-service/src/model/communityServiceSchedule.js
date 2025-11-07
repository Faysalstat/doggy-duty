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
    startingDate:Sequelize.STRING,
    lastInvoiceGenerated:Sequelize.STRING,
    noOfPetStation:Sequelize.INTEGER,
    noOfGarbageBin:Sequelize.INTEGER,
    chargePerPetStation:Sequelize.DOUBLE,
    chargePerGarbageBin:Sequelize.DOUBLE,
    isPaused:Sequelize.BOOLEAN,
    isTaxApplicable:Sequelize.BOOLEAN,
    isFlatRate:Sequelize.BOOLEAN,
    flatRateAmount:Sequelize.DOUBLE,
    serviceName:Sequelize.STRING,
  },
  {
    freezeTableName: true,
  }
);

module.exports = CommunityServiceSchedule;
