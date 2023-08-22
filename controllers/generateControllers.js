const fs = require('fs');
const { targetDbSequelize } = require("./models/index");


function generateControllers() {
  for (const modelName in targetDbSequelize) {
    const model = targetDbSequelize[modelName];
    const controller = generateController(modelName, model);
    saveControllerToFile(modelName, controller);
  }
}

function generateController(modelName, model) {
  const controller = `
    const ${modelName} = require('../models').${modelName};

    module.exports = {
      create: async (req, res) => {
        try {
          const instance = await ${modelName}.create(req.body);
          return res.status(201).json(instance);
        } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      },
      update: async (req, res) => {
        try {
          const [updatedRows] = await ${modelName}.update(req.body, {
            where: { id: req.params.id },
          });
          if (updatedRows === 0) {
            return res.status(404).json({ error: '${modelName} not found' });
          }
          return res.status(200).json({ message: '${modelName} updated successfully' });
        } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      },
      findAll: async (req, res) => {
        try {
          const instances = await ${modelName}.findAll();
          return res.status(200).json(instances);
        } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      },
      findById: async (req, res) => {
        try {
          const instance = await ${modelName}.findByPk(req.params.id);
          if (!instance) {
            return res.status(404).json({ error: '${modelName} not found' });
          }
          return res.status(200).json(instance);
        } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      },
      delete: async (req, res) => {
        try {
          const deletedRows = await ${modelName}.destroy({
            where: { id: req.params.id },
          });
          if (deletedRows === 0) {
            return res.status(404).json({ error: '${modelName} not found' });
          }
          return res.status(204).send(); // No content
        } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      },
    };
  `;

  return controller;
}

function saveControllerToFile(modelName, controller) {
  const filePath = `controllers/${modelName.toLowerCase()}Controller.js`;
  fs.writeFileSync(filePath, controller);
  console.log(`Controller for ${modelName} saved to ${filePath}`);
}

generateControllers();
