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
// prod 
// exports.sequelize = new Sequelize('vatasolu_accontsoft_prod','vatasolu_vatadmin', 'Bzt#?ajtxWe?', {
//   host: 's813.bom1.mysecurecloudhost.com',
//   port: '3306',
//   dialect: 'mysql',
//   pool:pool
// });

// dev 
exports.sequelize = new Sequelize('waste_manager_db', 'root', 'root', {
  host: 'localhost',
  port: '3306',
  dialect: 'mysql',
  pool: pool
});
