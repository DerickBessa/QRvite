// api/routes/party.js
const express = require("express");
const router = express.Router();
const PartyController = require("../../Backend/controllers/PartyController");

router.get("/", PartyController.getAll);
router.get("/:id", PartyController.getById);
router.post("/", PartyController.create);
router.put("/:id", PartyController.update);
router.delete("/:id", PartyController.delete);
router.get("/:id/checkins", PartyController.getCheckins);

module.exports = router;