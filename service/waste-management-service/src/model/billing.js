const Sequelize = require("sequelize");
const db = require("../connector/db-connector");
const Community = require("./community");

const Billing = db.sequelize.define(
  "billing",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    totalAmount: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    invoiceDate: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("pending", "paid"),
      defaultValue: "pending",
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Billing;
