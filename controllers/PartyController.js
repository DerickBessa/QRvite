const PartyService = require("../services/PartyService");

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const PartyController = {
  getAll: handle(async (req, res) => {
    res.json(await PartyService.getAll());
  }),

  getById: handle(async (req, res) => {
    res.json(await PartyService.getById(req.params.id));
  }),

  create: handle(async (req, res) => {
    res.status(201).json(await PartyService.create(req.body));
  }),

  update: handle(async (req, res) => {
    res.json(await PartyService.update(req.params.id, req.body));
  }),

  delete: handle(async (req, res) => {
    await PartyService.delete(req.params.id);
    res.json({ message: "Party deletada com sucesso" });
  }),

  getCheckins: handle(async (req, res) => {
    res.json(await PartyService.getCheckins(req.params.id));
  }),

  addGuest: handle(async (req, res) => {
    res.json(await PartyService.addGuest(req.params.id, req.body.personId));
  }),

  removeGuest: handle(async (req, res) => {
    res.json(await PartyService.removeGuest(req.params.id, req.params.personId));
  }),
};

module.exports = PartyController;