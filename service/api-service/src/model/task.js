const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const Task = db.sequelize.define(
  "task",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    status: Sequelize.STRING,
    scheduledDate: Sequelize.DATEONLY,
    isBagRollReplaced:Sequelize.BOOLEAN,
    isBinReplaced:Sequelize.BOOLEAN,
    isNewStationInstalled:Sequelize.BOOLEAN,
    isHandSanitizerReplaced:Sequelize.BOOLEAN,
    noOfPetStation: Sequelize.INTEGER,
    noOfGarbageBin: Sequelize.INTEGER,
    noOfBagRollReplaced: Sequelize.INTEGER,
    noOfBinReplacement: Sequelize.INTEGER,
    noOfHandSanitizerReplacement: Sequelize.INTEGER,
    noOfStationInstalled: Sequelize.INTEGER,
    chargePerPetStation: Sequelize.DOUBLE,
    chargePerGarbageBin: Sequelize.DOUBLE,
    chargePerBagRoll: Sequelize.DOUBLE,
    chargePerBinReplacement: Sequelize.DOUBLE,
    chargePerNewStationInstallment: Sequelize.DOUBLE,
    chargePerHandSanitizer: Sequelize.DOUBLE,
  },
  {
    freezeTableName: true,
  }
);

module.exports = Task;
