const Sequelize = require('sequelize');
const sequelize = require('../sqlite/db_connector');

const SomeData = sequelize.define('some_data', {
  someData: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  someOtherData: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, {});

SomeData.sync();

module.exports = SomeData;