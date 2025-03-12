const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const AppConfig = db.sequelize.define(
  "appconfig",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    configName:Sequelize.STRING,
    value:Sequelize.STRING
  },
  {
    freezeTableName: true,
  }
);

module.exports = AppConfig;