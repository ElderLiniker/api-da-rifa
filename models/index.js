

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database'); // Certifique-se de que o caminho está correto
sequelize.authenticate()
    .then(() => console.log('Conexão bem-sucedida'))
    .catch(err => console.error('Erro ao conectar:', err));
    sequelize.sync({ alter: true })
    .then(() => console.log('Banco de dados sincronizado'))
    .catch(err => console.error('Erro ao sincronizar:', err));



const db = {};

// Carrega todos os modelos automaticamente
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js') // Ignora o próprio arquivo index.js
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Associações (caso haja)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
