// api/routes/family.js
const express = require("express");
const router = express.Router();
const FamilyController = require("../../Backend/controllers/FamilyController");

router.get("/", FamilyController.getAll);
router.get("/:id", FamilyController.getById);
router.post("/", FamilyController.create);
router.put("/:id", FamilyController.update);
router.delete("/:id", FamilyController.delete);
router.post("/:id/members", FamilyController.addMember);
router.delete("/:id/members/:personId", FamilyController.removeMember);

module.exports = router;