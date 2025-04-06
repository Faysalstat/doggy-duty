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

// // dev 
exports.sequelize = new Sequelize('doggy_duty_db', 'root', 'root', {
  host: 'localhost',
  port: '3306',
  dialect: 'mysql',
  pool: pool,
  timezone: "America/New_York", // Ensures Sequelize treats times in EDT
});

// dev 
// exports.sequelize = new Sequelize('glimqkxv_doggy_duty_db', 'glimqkxv_doggy_duty_admin', 'i#W@Qq0WoQ{t', {
//   host: 'premium290.web-hosting.com',
//   port: '3306',
//   dialect: 'mysql',
//   pool: pool
// });

// exports.sequelize = new Sequelize('vatasolu_doggy_duty', 'vatasolu_doggy_duty_admin', 'h!*kq.CO=.3@', {
//   host: 's813.bom1.mysecurecloudhost.com',
//   port: '3306',
//   dialect: 'mysql',
//   pool: pool,
//   // timezone: "America/New_York", // Ensures Sequelize treats times in EDT
// });
