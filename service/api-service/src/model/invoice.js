const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const Invoice = db.sequelize.define(
  "invoice",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    totalAmount: Sequelize.FLOAT,
    totalGarbageBins: Sequelize.INTEGER,
    totalPetStations: Sequelize.INTEGER,
    totalBagReplaced: Sequelize.INTEGER,
    costPerGarbageBins: Sequelize.FLOAT,           
    costPerPetStations: Sequelize.FLOAT,
    costPerBagReplaced: Sequelize.FLOAT,
    invoiceDate: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    status:Sequelize.STRING,
  },
  {
    freezeTableName: true,
  }
);


module.exports = Invoice;
