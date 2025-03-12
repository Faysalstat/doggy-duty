const mysql = require("mysql")
const dbConfig = require("../config/db.config")
const { Sequelize } = require('sequelize');
const pool = {
  max: 15,
  min: 5,
  idle: 20000,
  evict: 15000,
  acquire: 30000
};

// dev 
exports.sequelize = new Sequelize('doggy_duty_db', 'root', 'root', {
  host: 'localhost',
  port: '3306',
  dialect: 'mysql',
  pool: pool
});
