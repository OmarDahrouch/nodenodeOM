const express = require("express");
const testController = require("../../controllers/generatedConstrollers/testController");

const router = express.Router();

router.get("/", testController.findAll);
router.post("/", testController.create);
// router.put("/:id", testController.update);
// router.get("/:id", testController.findById);
// router.delete("/:id", testController.delete);

module.exports = router;
  