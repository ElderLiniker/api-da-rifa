module.exports = (sequelize, DataTypes) => {
  const Rifa = sequelize.define("Rifa", {
      nome: {
          type: DataTypes.STRING,
          allowNull: false
      },
      numero: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true
      }
  });

  return Rifa;
};
