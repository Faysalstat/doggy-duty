const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const EventSchedule = db.sequelize.define(
  "eventSchedule",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    status: Sequelize.STRING,
    scheduledDate: Sequelize.STRING,
    communityName: Sequelize.STRING,
    title: Sequelize.STRING,
    description: Sequelize.STRING,
  },
  {
    freezeTableName: true,
  }
);

module.exports = EventSchedule;
