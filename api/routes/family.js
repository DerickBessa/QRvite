// api/routes/family.js
// Rotas globais de família — sem vínculo obrigatório com festa.
// Utilizadas pela tela de criação de QR (HomePage).

const express = require("express");
const router = express.Router();
const FamilyController = require("../../controllers/FamilyController");

// Listagem e criação global
router.get("/", FamilyController.getAll);
router.post("/", FamilyController.createGlobal);

// Operações por ID
router.get("/:id", FamilyController.getByIdGlobal);
router.delete("/:id", FamilyController.deleteGlobal);

// Membros
router.post("/:id/members", FamilyController.addMemberGlobal);
router.delete("/:id/members/:personId", FamilyController.removeMemberGlobal);

// PDF da família
router.get("/:id/pdf", FamilyController.getPDF);

module.exports = router;