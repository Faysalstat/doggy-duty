const Sequelize = require("sequelize");
const db = require("../connector/db-connector");
const { title } = require("process");
const { schedule } = require("node-cron");

const EventSchedule = db.sequelize.define(
  "eventSchedule",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    status: Sequelize.STRING,
    scheduledDate: Sequelize.STRING,
    scheduledTime: Sequelize.STRING,
    title: Sequelize.STRING,
    description: Sequelize.STRING,
  },
  {
    freezeTableName: true,
  }
);

module.exports = EventSchedule;
