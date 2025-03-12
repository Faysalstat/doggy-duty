const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const Community = db.sequelize.define(
  "community",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    communityName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    communityAddress: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gateCode: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    camOfcommunity: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lockBoxCode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    specialRequest: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    latitude: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    longitude: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
  }
);

module.exports = Community;