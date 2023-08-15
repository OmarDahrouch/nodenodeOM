const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Projet = sequelize.define("Projet", {
    Nom_Projet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  Projet.associate = function (models) {
    Projet.hasMany(models.Model);
  };
  return Projet;
};
