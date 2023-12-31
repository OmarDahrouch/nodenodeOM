const express = require('express');
const { Sequelize } = require("sequelize");
const fs = require('fs');
const path = require('path');
const generateController = require('./controllers/generateControllers')
const generateRoutes = require('./routes/generateRoutes')
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

// Loading Routes ----------------------------------------------------------------------
function setupGeneratedRoutes(app) {
  const generatedRoutesFolderPath = path.join(__dirname, 'routes', 'generatedRoutes');

  function checkAndLoadRoutes() {
    if (fs.existsSync(generatedRoutesFolderPath)) {
      fs.readdirSync(generatedRoutesFolderPath).forEach(file => {
        const filePath = path.join(generatedRoutesFolderPath, file);
        const fileNameWithoutRoute = path.basename(file, 'Route.js');

        const routeModule = require(filePath);

        if (typeof routeModule === 'function') {
          app.use("/" + fileNameWithoutRoute, routeModule);
        }
      });
    } else {
      setTimeout(checkAndLoadRoutes, 1000); 
    }
  }

  checkAndLoadRoutes(); 
}

setupGeneratedRoutes(app);



// DataBase Config ----------------------------------------------------
const { db } = require("./models/index");

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.use(express.json());
