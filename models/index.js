'use strict';

require("dotenv").config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { log } = require('console');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const db = {};
const dbtarget = {};

const targetDbConfig = {
  username: process.env.TARGET_DB_USERNAME,
  password: process.env.TARGET_DB_PASSWORD,
  database: process.env.TARGET_DB_DATABASE,
  host: process.env.TARGET_DB_HOST,
  dialect: process.env.TARGET_DB_DIALECT,
};

const targetDbSequelize = new Sequelize(targetDbConfig);


let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

async function logModelsWithColumnsAndAssociations(Id) {
  try {
    const modelsWithColumns = await db.Model.findAll({
      where: { ProjetId: Id },
      include: [
        {
          model: db.Colonne,
          include: [db.TypeColonne],
        },
        {
          model: db.ModelAssociation,
          as: 'modelAssociations',
          include: [db.Association, { model: db.Model, as: "modelB" }],
        },
      ],
    });

    return modelsWithColumns;

  } catch (error) {
    console.error('Error:', error);
    throw new Error('An error occurred');
  }
}

async function getAssociationsForModel(modelName) {
  try {
    const associationsData = await db.ModelAssociation.findAll({
      where: { '$modelA.nomModel$': modelName }, include: [{ model: db.Model, as: 'modelA' }, { model: db.Model, as: 'modelB' }, db.Association]
    });

    return associationsData;
  } catch (error) {
    console.error('Error fetching associations data:', error);
    return [];
  }
}

const generateModel = async (ProjectId) => {
  const Data = await logModelsWithColumnsAndAssociations(ProjectId);
  const generatedModels = [];

  for (const model of Data) {

    const colonneData = await model.Colonnes;
    const columnDefinitions = [];

    for (const colonne of colonneData) {

      const columnDef = {
        type: Sequelize.DataTypes[colonne.TypeColonne.nomType],
        allowNull: colonne.allowNull,
        defaultValue: colonne.defaultValue,
        autoIncrement: colonne.autoIncrement,
        primaryKey: colonne.primaryKey,
        unique: colonne.unique,
        field: colonne.field || colonne.nomColonne,
      };
      columnDefinitions.push({ [colonne.nomColonne]: columnDef });
    }
    const modelName = model.nomModel;


    // console.log(targetDbSequelize);
    const generatedModel = targetDbSequelize.define(modelName, {
      ...Object.assign({}, ...columnDefinitions),
    }, {
      paranoid: model.paranoid,
      timestamps: model.timestamp,
      createdAt: model.createdAtModel || "createdAt",
      updatedAt: model.updatedAtModel || "updatedAt",
      deletedAt: model.deletedAtModel || "deletedAt",
      underscored: model.underscored,
      freezeTableName: model.freezeTableName,
      paranoidKey: model.paranoidKey,
      version: model.version
    });


    dbtarget[modelName] = generatedModel;

    generatedModels.push(generatedModel);
  }

  console.log('Generating models', generatedModels);
  return generatedModels;
}

const ProjectId = process.env.ProjetId;

async function loadGeneratedModels() {
  try {
    const generatedModels = await generateModel(ProjectId);

    for (const model of generatedModels) {
      const associationsData = await getAssociationsForModel(model.name);
      for (const association of associationsData) {
        if (association.Association.typeAssociation === 'belongsTo') {
          model.belongsTo(dbtarget[association.modelB.nomModel]);
        } else if (association.Association.typeAssociation === 'hasMany') {
          model.hasMany(dbtarget[association.modelB.nomModel]);
        } else if (association.Association.typeAssociation === 'hasOne') {
          model.hasOne(dbtarget[association.modelB.nomModel]);
        } else if (association.Association.typeAssociation === 'belongsToMany') {
          model.belongsToMany(dbtarget[association.modelB.nomModel], { through: `${model.name}_${association.modelB.nomModel}` });
        }
      }
    }
    await dbtarget.targetDbSequelize.sync({ alter: true });

    console.log('Generated models loaded successfully.');


  } catch (error) {
    console.error('Error loading generated models:', error);
  }
}



db.sequelize = sequelize;
db.Sequelize = Sequelize;

dbtarget.targetDbSequelize = targetDbSequelize;
dbtarget.Sequelize = Sequelize;


module.exports = {
  db,
  dbtarget: (async () => {
    await loadGeneratedModels();
    return dbtarget;
  })(),
};