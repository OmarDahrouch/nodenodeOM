'use strict';

require("dotenv").config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const { log } = require('console');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const db = {};

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


const generateModel = async (ProjectId) => {

  const Data = await logModelsWithColumnsAndAssociations(ProjectId)
  const modelDefinition = []
  for (const model of Data) {
    const colonneData = await model.Colonnes
    const associationData = await model.modelAssociations
    const columnDefinitions = [];
    const associationDefinitions = [];


    for (const colonne of colonneData) {
      const columnDef = `${colonne.nomColonne}: {
        type: DataTypes.${colonne.TypeColonne.nomType},
        allowNull: ${colonne.allowNull},
        defaultValue: "${colonne.defaultValue}",
        autoIncrement: ${colonne.autoIncrement},
        primaryKey: ${colonne.primaryKey},
        unique: ${colonne.unique},
        field: "${colonne.field}",
      }`;
      columnDefinitions.push(columnDef);
    }

    for (const association of associationData) {
      const associationDef = `${model.nomModel}.${association.Association.typeAssociation}(models.${association.modelB.nomModel});`;
      associationDefinitions.push(associationDef);
    }

    let modelCode = `
    const { Sequelize, DataTypes } = require("sequelize");
    module.exports = (sequelize) => {
    const ${model.nomModel} = sequelize.define('${model.nomModel}', {
      //colonnes
      ${columnDefinitions.join(',\n')}
    });

    //Association
    ${associationDefinitions.length > 0
        ? `
    ${model.nomModel}.associate = function (models){
      ${associationDefinitions.join("")}
    };`
        : ""
      }
    return ${model.nomModel};
    }
`;
    modelDefinition.push(modelCode);
  }
  console.log('Generating model', modelDefinition)
  return modelDefinition
}

const ProjectId = process.env.ProjetId;


async function loadGeneratedModels() {
  try {
    const generatedModelDefinitions = await generateModel(ProjectId);

    const dynamicModulesDir = path.join(__dirname, 'dynamic_modules');

    if (!fs.existsSync(dynamicModulesDir)) {
      fs.mkdirSync(dynamicModulesDir);
    }

    const generatedModels = [];

    for (let i = 0; i < generatedModelDefinitions.length; i++) {
      const modelDefinition = generatedModelDefinitions[i];
      const dynamicModulePath = path.join(dynamicModulesDir, `model_${i}.js`);
      // Create a dynamic module file with the model definition
      console.log('Generating dynamic module', dynamicModulePath)
      fs.writeFileSync(dynamicModulePath, modelDefinition);

      // Load the dynamic module and call the exported function to get the model instance
      const generatedModelFactoryFunction = require(dynamicModulePath);
      const generatedModelInstance = generatedModelFactoryFunction(sequelize);

      generatedModels.push(generatedModelInstance);
    }
    await sequelize.sync();

    console.log('Generated models loaded successfully.');

  } catch (error) {
    console.error('Error loading generated models:', error);
  }
}

loadGeneratedModels();


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;