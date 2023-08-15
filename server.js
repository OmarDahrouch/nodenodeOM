const express = require("express");
const { Sequelize } = require("sequelize");
// const userRoute = require("./routes/userRoute");
const cors = require("cors");

const app = express();
const PORT = 3030;

app.use(cors());

// DataBase Config ----------------------------------------------------
const db = require("./models/index");

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.use(express.json());


