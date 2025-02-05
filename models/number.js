module.exports = (sequelize, DataTypes) => {
    const Number = sequelize.define('Number', {
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });
  
    return Number;
  };
  

