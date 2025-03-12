const Sequelize = require("sequelize");
const db = require("../connector/db-connector");
const JobOrder = require("./job-order");
const Community = require("./community");
const Service = require("./service");

const Task = db.sequelize.define(
  "task",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    status: {
      type: Sequelize.ENUM("pending", "completed"),
      defaultValue: "pending",
    },
    scheduledTime: Sequelize.DATEONLY,
  },
  {
    freezeTableName: true,
  }
);

module.exports = Task;
