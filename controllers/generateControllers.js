const fs = require('fs');
const { targetDbSequelize } = require("../models/index");

function generateControllers() {
  (async () => {
    const targetSequelize = await targetDbSequelize;

    for (const modelName in targetSequelize.models) {
      const controller = generateController(modelName);
      saveControllerToFile(modelName, controller);
    }

  })();
}

function generateController(modelName) {
  const controller = `const { targetDbSequelize } = require("../models/index");

    module.exports = {
      create: async (req, res) => {
        try {
          const instance = await targetDbSequelize.${modelName}.create(req.body);
          return res.status(201).json(instance);
        } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      },
      update: async (req, res) => {
        try {
          const [updatedRows] = await targetDbSequelize.${modelName}.update(req.body, {
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
          const instances = await targetDbSequelize.${modelName}.findAll();
          return res.status(200).json(instances);
        } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      },
      findById: async (req, res) => {
        try {
          const instance = await targetDbSequelize.${modelName}.findByPk(req.params.id);
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
          const deletedRows = await targetDbSequelize.${modelName}.destroy({
            where: { id: req.params.id },
          });
          if (deletedRows === 0) {
            return res.status(404).json({ error: '${modelName} not found' });
          }
          return res.status(204).send(); 
        } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
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