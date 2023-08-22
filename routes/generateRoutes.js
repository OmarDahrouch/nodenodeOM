const db = require("../models/index");
const fs = require("fs");
require("dotenv").config();
const env = process.env.NODE_ENV || 'development';


async function logModels(Id) {
    try {
      console.log("db",db);
      const models = await db.Model.findAll({
        where: { ProjetId: Id },
      });

      return models;
    } catch (error) {
      console.error("Error:", error);
    }
  }
const generateRoutes = async(ProjectId) => {
    const Data = await logModels(ProjectId);
    for(const model of Data){

        let routeCode = `
        const express = require("express");
        const ${model.nomModel}Controller = require("../controllers/${model.nomModel}Controller");

        const router = express.Router();

        router.get("/", ${model.nomModel}Controller.getAll);
        router.get("/:id", ${model.nomModel}Controller.getById);
        router.post("/", ${model.nomModel}Controller.create);
        router.put("/:id", ${model.nomModel}Controller.update);
        router.delete("/:id", ${model.nomModel}Controller.delete);

        module.exports = router;

        `;
        const routeFileName = `${model.nomModel}Route.js`;
        const routeFilePath = path.join(__dirname, routeFileName);
        fs.writeFileSync(routeFilePath, routeCode);
    }
};


const ProjectId = process.env.ProjetId;
generateRoutes(ProjectId);

console.log("generateRoutes",generateRoutes);

module.exports = generateRoutes;