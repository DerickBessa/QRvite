// controllers/PersonController.js

const PersonService = require("../../services/PersonService");

// Helper pra não repetir try/catch em todo lugar
const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, ...(err.person && { person: err.person }) });
  }
};

const PersonController = {
  getAll: handle(async (req, res) => {
    res.json(await PersonService.getAll());
  }),

  getById: handle(async (req, res) => {
    res.json(await PersonService.getById(req.params.id));
  }),

  create: handle(async (req, res) => {
    res.status(201).json(await PersonService.create(req.body));
  }),

  update: handle(async (req, res) => {
    res.json(await PersonService.update(req.params.id, req.body));
  }),

  delete: handle(async (req, res) => {
    await PersonService.delete(req.params.id);
    res.json({ message: "Person deletada com sucesso" });
  }),

  checkin: handle(async (req, res) => {
    const person = await PersonService.checkin(req.params.id);
    res.json({ message: "Check-in realizado com sucesso!", person });
  }),

  getPDF: handle(async (req, res) => {
    const person = await PersonService.getById(req.params.id);
    const pdfBuffer = await PersonService.getPDF(req.params.id);
    const fileName = `${person.nome.replace(/\s+/g, "_").toUpperCase()}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(pdfBuffer);
  }),
};

module.exports = PersonController;