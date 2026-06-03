// api/routes/family.js
// LEGADO: estas rotas retornam dados globais sem filtro de festa.
// Utilize /api/parties/:partyId/families para acesso correto e isolado.
const express = require("express");
const router = express.Router();

router.all("*", (req, res) => {
  res.status(410).json({
    error: "Rota descontinuada. Use /api/parties/:partyId/families",
  });
});

module.exports = router;
