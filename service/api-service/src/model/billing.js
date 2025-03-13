const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const Billing = db.sequelize.define(
  "billing",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    totalAmount: Sequelize.FLOAT,
    taskCompletionDate: Sequelize.DATEONLY,
    status: Sequelize.STRING,
  },
  {
    freezeTableName: true,
  }
);

module.exports = Billing;
