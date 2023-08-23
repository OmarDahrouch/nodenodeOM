const { dbtarget } = require("../models/index");
const fs = require("fs");
require("dotenv").config();
const env = process.env.NODE_ENV || 'development';

function generateRouters() {
  (async () => {
    const dbt = await dbtarget;

    for (const modelName in dbt.targetDbSequelize.models) {
      const routeCode = generateRouter(modelName);
      saveRouteToFile(modelName, routeCode);
    }

  })();
}

function generateRouter(nameModel) {
  const modelName = nameModel.toLowerCase();
  const routeCode = `const express = require("express");
const ${modelName}Controller = require("../../controllers/generatedConstrollers/${modelName}Controller");

const router = express.Router();

router.get("/", ${modelName}Controller.findAll);
router.post("/", ${modelName}Controller.create);
router.put("/:id", ${modelName}Controller.update);
router.delete("/:id", ${modelName}Controller.delete);
router.get("/:id", ${modelName}Controller.findById);

module.exports = router;
  `;
  return routeCode;
}

function saveRouteToFile(modelName, routeCode) {
  const folderPath = 'routes/generatedRoutes';
  const filePath = `${folderPath}/${modelName.toLowerCase()}Route.js`;

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  fs.writeFileSync(filePath, routeCode);
  console.log(`Route for ${modelName} saved to ${filePath}`);
}

generateRouters();


module.exports = generateRouter;