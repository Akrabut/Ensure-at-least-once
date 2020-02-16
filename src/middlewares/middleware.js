const sqlCon = require('../sqlite/db_connector');
const redisCon = require('../redis/db_connector');

module.exports = {
  sqlCon,
  redisCon,
};