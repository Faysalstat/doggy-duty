const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const InvoiceBillMapping = db.sequelize.define(
  "invoice_bill_mapping",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    }
  },
  {
    freezeTableName: true,
  }
);

module.exports = InvoiceBillMapping;
