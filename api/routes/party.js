const express = require("express");
const router = express.Router();
const PartyController = require("../../controllers/PartyController");
 
router.get("/", PartyController.getAll);
router.get("/:id", PartyController.getById);
router.post("/", PartyController.create);
router.put("/:id", PartyController.update);
router.delete("/:id", PartyController.delete);
router.get("/:id/checkins", PartyController.getCheckins);
 
// Gerenciar convidados da festa
router.post("/:id/guests", PartyController.addGuest);
router.delete("/:id/guests/:personId", PartyController.removeGuest);
 
module.exports = router;
 