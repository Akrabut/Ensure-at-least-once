const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite'
});

sequelize
  .authenticate()
  .then(() => console.log('DB connection successful'));

module.exports = sequelize;