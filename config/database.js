
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('meubanco', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql', // Especifique o dialeto do banco de dados
});

module.exports = sequelize;


