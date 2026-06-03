// api/index.js
// Entry point para dev local E para Vercel (serverless)

const express = require("express");
const cors = require("cors");

const personRoutes = require("./routes/person");
const familyRoutes = require("./routes/family");
const partyRoutes = require("./routes/party");

const app = express();

// ─────────────────────────────────────────
// Middlewares
// ─────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────
// Health check
// ─────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// ─────────────────────────────────────────
// Rotas
// ─────────────────────────────────────────
app.use("/api/persons", personRoutes);
app.use("/api/families", familyRoutes);
app.use("/api/parties", partyRoutes);

// ─────────────────────────────────────────
// 404 handler
// ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Rota ${req.method} ${req.path} não encontrada` });
});

// ─────────────────────────────────────────
// Error handler global
// ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor", detail: err.message });
});

// ─────────────────────────────────────────
// Dev local: sobe o servidor
// Vercel: exporta o app como handler
// ─────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 TáNaLista API rodando em http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;