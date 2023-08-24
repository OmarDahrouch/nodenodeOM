const express = require("express");
const pcController = require("../../controllers/generatedConstrollers/pcController");

const router = express.Router();

router.get("/", pcController.findAll);
router.post("/", pcController.create);
router.get("/:id", pcController.findById);
router.delete("/:id", pcController.delete);
router.put("/:id", pcController.update);

module.exports = router;
  