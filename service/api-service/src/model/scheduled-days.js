const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const ScheduledDays = db.sequelize.define(
  "scheduledDays",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    scheduledDay:Sequelize.STRING,
    lastServedDate:Sequelize.STRING,
    isSelected:Sequelize.BOOLEAN
  },
  {
    freezeTableName: true,
  }
);

module.exports = ScheduledDays;
