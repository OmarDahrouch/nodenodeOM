const fs = require('fs');
const { dbtarget, db } = require("../models/index");

function generateControllers() {

  (async () => {
    const dbt = await dbtarget;
    for (const modelName in dbt.targetDbSequelize.models) {
      const controller = generateController(modelName);
      saveControllerToFile(modelName, controller);
    }

  })();
}

function generateController(modelName) {
  const controller = `const { dbtarget } = require("../../models/index");

    module.exports = {
      create: async (req, res) => {
        try {
          const dbt = await dbtarget;
          const instance = await dbt.${modelName}.create(req.body);
          return res.status(201).json(instance);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
      update: async (req, res) => {
        try {
          const dbt = await dbtarget;
          const [updatedRows] = await dbt.${modelName}.update(req.body, {
            where: { id: req.params.id },
          });
          if (updatedRows === 0) {
            return res.status(404).json({ error: '${modelName} not found' });
          }
          return res.status(200).json({ message: '${modelName} updated successfully' });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
      findAll: async (req, res) => {
        try {
          const dbt = await dbtarget;
          const instances = await dbt.${modelName}.findAll();
          return res.status(200).json(instances);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
      findById: async (req, res) => {
        try {
          const dbt = await dbtarget;
          const instance = await dbt.${modelName}.findByPk(req.params.id);
          if (!instance) {
            return res.status(404).json({ error: '${modelName} not found' });
          }
          return res.status(200).json(instance);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
      delete: async (req, res) => {
        try {
          const dbt = await dbtarget;
          const deletedRows = await dbt.${modelName}.destroy({
            where: { id: req.params.id },
          });
          if (deletedRows === 0) {
            return res.status(404).json({ error: '${modelName} not found' });
          }
          return res.status(204).send(); 
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
    };
  `;

  return controller;
}

function saveControllerToFile(modelName, controller) {
  const folderPath = 'controllers/generatedConstrollers';
  const filePath = `${folderPath}/${modelName.toLowerCase()}Controller.js`;

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  fs.writeFileSync(filePath, controller);
  console.log(`Controller for ${modelName} saved to ${filePath}`);
}

generateControllers();

module.exports = generateControllers;