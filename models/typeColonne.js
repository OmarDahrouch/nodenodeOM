const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Type_Colonne = sequelize.define("TypeColonne", {
    nomType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Type_Colonne.associate = function (models) {
    Type_Colonne.hasMany(models.Colonne);
  };
  return Type_Colonne;
};
