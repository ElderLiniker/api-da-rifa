const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Number = sequelize.define('Number', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    number: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    paid: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    tableName: 'numbers',
    timestamps: false
});

module.exports = Number;

