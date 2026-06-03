// controllers/FamilyController.js

const FamilyService = require("../services/FamilyService");

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const FamilyController = {
  // GET /api/parties/:partyId/families
  getByParty: handle(async (req, res) => {
    res.json(await FamilyService.getByParty(req.params.partyId));
  }),

  // GET /api/parties/:partyId/families/:id
  getById: handle(async (req, res) => {
    res.json(await FamilyService.getById(req.params.id, req.params.partyId));
  }),

  // POST /api/parties/:partyId/families
  create: handle(async (req, res) => {
    res.status(201).json(await FamilyService.create({
      ...req.body,
      partyId: req.params.partyId,
    }));
  }),

  // PUT /api/parties/:partyId/families/:id
  update: handle(async (req, res) => {
    res.json(await FamilyService.update(req.params.id, req.body, req.params.partyId));
  }),

  // DELETE /api/parties/:partyId/families/:id
  delete: handle(async (req, res) => {
    await FamilyService.delete(req.params.id, req.params.partyId);
    res.json({ message: "Família deletada com sucesso" });
  }),

  // POST /api/parties/:partyId/families/:id/members
  addMember: handle(async (req, res) => {
    res.json(await FamilyService.addMember(req.params.id, req.body.personId, req.params.partyId));
  }),

  // DELETE /api/parties/:partyId/families/:id/members/:personId
  removeMember: handle(async (req, res) => {
    res.json(await FamilyService.removeMember(req.params.id, req.params.personId, req.params.partyId));
  }),
};

module.exports = FamilyController;
