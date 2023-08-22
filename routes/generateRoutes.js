const express = require("express");
const fs = require("fs");
const path = require("path");

const generateRoutes = async () => {
  const modelsPath = path.join(__dirname, "../models");
  const modelFiles = fs.readdirSync(modelsPath).filter(file => file.endsWith(".js"));

  for (const modelFile of modelFiles) {
    const modelName = path.basename(modelFile, ".js");
    const routeCode = `const express = require("express");
const router = express.Router();
const ${modelName}Controller = require("../controllers/${modelName}Controller");

router.get("/${modelName}", ${modelName}Controller.getAll);
router.get("/${modelName}:id", ${modelName}Controller.getById);
router.post("/${modelName}", ${modelName}Controller.create);
router.put("/${modelName}:id", ${modelName}Controller.update);
router.delete("/${modelName}:id", ${modelName}Controller.delete);

module.exports = router;
    `;

    const folderPath = 'routes/generatedRoutes';
    const filePath = `${folderPath}/${modelName.toLowerCase()}Route.js`;
  
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  
    fs.writeFileSync(filePath, routeCode);
    console.log(`Route for ${modelName} saved to ${filePath}`);
  
  }

  console.log("Routes generated successfully.");
};

generateRoutes();
