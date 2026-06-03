// api/routes/party.js
const express = require("express");
const router = express.Router();
const PartyController = require("../../controllers/PartyController");
const FamilyController = require("../../controllers/FamilyController");

router.get("/", PartyController.getAll);
router.get("/:id", PartyController.getById);
router.post("/", PartyController.create);
router.put("/:id", PartyController.update);
router.delete("/:id", PartyController.delete);
router.get("/:id/checkins", PartyController.getCheckins);

// Convidados da festa
router.post("/:id/guests", PartyController.addGuest);
router.delete("/:id/guests/:personId", PartyController.removeGuest);

// Famílias da festa (rotas aninhadas com partyId)
router.get("/:partyId/families", FamilyController.getByParty);
router.get("/:partyId/families/:id", FamilyController.getById);
router.post("/:partyId/families", FamilyController.create);
router.put("/:partyId/families/:id", FamilyController.update);
router.delete("/:partyId/families/:id", FamilyController.delete);
router.post("/:partyId/families/:id/members", FamilyController.addMember);
router.delete("/:partyId/families/:id/members/:personId", FamilyController.removeMember);

module.exports = router;
