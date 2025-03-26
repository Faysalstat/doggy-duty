const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const JobOrder = db.sequelize.define(
  "job_order",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    date: Sequelize.STRING
  },
  {
    freezeTableName: true,
  }
);

module.exports = JobOrder;
