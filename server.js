const express = require('express');
const { Sequelize } = require("sequelize");
const generateControllers = require('./controllers/generateControllers')

const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

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
