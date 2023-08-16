const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Model = sequelize.define("Model", {
    nomModel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paranoid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    timestamps: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAtModel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedAtModel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deletedAtModel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    underscored: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    freezeTableName: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    paranoidKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tableName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  Model.associate = function (models) {
    Model.belongsTo(models.Projet);
  };
  Model.associate = function (models) {
    Model.hasMany(models.Colonne);
    Model.hasMany(models.ModelAssociation, {
      foreignKey: "modelAId",
      as: "modelAssociations",
    });
  };

  return Model;
};
