// api/routes/person.js
const express = require("express");
const router = express.Router();
const PersonController = require("../../Backend/controllers/PersonController");

router.get("/", PersonController.getAll);
router.get("/:id", PersonController.getById);
router.post("/", PersonController.create);
router.put("/:id", PersonController.update);
router.delete("/:id", PersonController.delete);
router.post("/:id/checkin", PersonController.checkin);
router.get("/:id/pdf", PersonController.getPDF);

module.exports = router;