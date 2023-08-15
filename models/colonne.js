const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Colonne = sequelize.define("Colonne", {
    nomColonne: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    defaultValue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    allowNull: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    autoIncrement: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    primaryKey: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    unique: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    field: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  Colonne.associate = function (models) {
    Colonne.belongsTo(models.Model);
  };
  Colonne.associate = function (models) {
    Colonne.belongsTo(models.TypeColonne);
  };
  return Colonne;
};
