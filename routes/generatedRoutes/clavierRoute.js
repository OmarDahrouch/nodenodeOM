const express = require("express");
const clavierController = require("../../controllers/generatedConstrollers/clavierController");

const router = express.Router();

router.get("/", clavierController.findAll);
router.post("/", clavierController.create);
router.get("/:id", clavierController.findById);
router.delete("/:id", clavierController.delete);
router.put("/:id", clavierController.update);

module.exports = router;
  