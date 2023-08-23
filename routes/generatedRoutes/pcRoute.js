const express = require("express");
const pcController = require("../../controllers/generatedConstrollers/pcController");

const router = express.Router();

router.get("/", pcController.findAll);
router.post("/", pcController.create);
// router.put("/:id", pcController.update);
// router.get("/:id", pcController.findById);
// router.delete("/:id", pcController.delete);

module.exports = router;
  