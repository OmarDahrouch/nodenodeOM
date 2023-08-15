const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ModelAssociation = sequelize.define("ModelAssociation", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  });

  ModelAssociation.belongsTo(sequelize.models.Association, {
    foreignKey: {
      allowNull: false,
    }
  });

  ModelAssociation.belongsTo(sequelize.models.Model, {
    foreignKey: {
      allowNull: false,
      field: "modelAId",
    },
    as: "modelA",
  });

  ModelAssociation.belongsTo(sequelize.models.Model, {
    foreignKey: {
      allowNull: false,
      field: "modelBId",
    },
    as: "modelB",
  });

  return ModelAssociation;
};
