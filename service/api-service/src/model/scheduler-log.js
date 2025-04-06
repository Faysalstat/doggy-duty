const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const SchedulerLog = db.sequelize.define(
  "scheduler_logs",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    job_name: Sequelize.STRING,
    job_type: Sequelize.STRING,
    status: Sequelize.STRING,
    error_message: Sequelize.STRING
  },
  {
    freezeTableName: true,
  }
);

module.exports = SchedulerLog;
