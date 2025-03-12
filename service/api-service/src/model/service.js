const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const Service = db.sequelize.define(
  "service",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    serviceName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    serviceCharge: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Service;
