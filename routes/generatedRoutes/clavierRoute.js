const express = require("express");
const clavierController = require("../../controllers/generatedConstrollers/clavierController");

const router = express.Router();

router.get("/", clavierController.findAll);
router.post("/", clavierController.create);
// router.put("/:id", clavierController.update);
// router.get("/:id", clavierController.findById);
// router.delete("/:id", clavierController.delete);

module.exports = router;
  