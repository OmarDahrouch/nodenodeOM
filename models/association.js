const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Association = sequelize.define("Association", {
    typeAssociation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Association;
};
