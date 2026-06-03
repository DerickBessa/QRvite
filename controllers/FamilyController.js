// controllers/FamilyController.js

const FamilyService = require("../../services/FamilyService");

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const FamilyController = {
  getAll: handle(async (req, res) => {
    res.json(await FamilyService.getAll());
  }),

  getById: handle(async (req, res) => {
    res.json(await FamilyService.getById(req.params.id));
  }),

  create: handle(async (req, res) => {
    res.status(201).json(await FamilyService.create(req.body));
  }),

  update: handle(async (req, res) => {
    res.json(await FamilyService.update(req.params.id, req.body));
  }),

  delete: handle(async (req, res) => {
    await FamilyService.delete(req.params.id);
    res.json({ message: "Família deletada com sucesso" });
  }),

  addMember: handle(async (req, res) => {
    res.json(await FamilyService.addMember(req.params.id, req.body.personId));
  }),

  removeMember: handle(async (req, res) => {
    res.json(await FamilyService.removeMember(req.params.id, req.params.personId));
  }),
};

module.exports = FamilyController;