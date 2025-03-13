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
    noOfPetStation: Sequelize.INTEGER,
    noOfGarbageBin: Sequelize.INTEGER,
    noOfBagRollReplaced: Sequelize.INTEGER,
    chargePerPetStation: Sequelize.DOUBLE,
    chargePerGarbageBin: Sequelize.DOUBLE,
    chargePerBagRoll: Sequelize.DOUBLE,
  },
  {
    freezeTableName: true,
  }
);

module.exports = Task;
