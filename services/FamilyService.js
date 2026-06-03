// services/FamilyService.js

const FamilyRepository = require("../repositories/FamilyRepository");
const Family = require("../models/Family");
const prisma = require("../lib/prisma");

class FamilyService {
  // Listagem global (legado — não exposta via rota principal)
  async getAll() {
    return FamilyRepository.findAll();
  }

  // Listagem filtrada por festa
  async getByParty(partyId) {
    if (!partyId) throw Object.assign(new Error("partyId é obrigatório"), { status: 400 });
    return FamilyRepository.findByParty(partyId);
  }

  async getById(id, partyId = null) {
    const family = await FamilyRepository.findById(id, partyId);
    if (!family) throw Object.assign(new Error("Família não encontrada"), { status: 404 });
    return family;
  }

  async create({ familyName, familySize, partyId }) {
    Family.validate({ familyName });
    if (!partyId) throw Object.assign(new Error("partyId é obrigatório"), { status: 400 });
    return FamilyRepository.create({
      familyName: familyName.trim(),
      familySize: familySize || 0,
      party: { connect: { id: partyId } },
    });
  }

  async update(id, data, partyId = null) {
    await this.getById(id, partyId);
    return FamilyRepository.update(id, data);
  }

  async delete(id, partyId = null) {
    await this.getById(id, partyId);
    await prisma.person.updateMany({ where: { familyId: id }, data: { familyId: null } });
    return FamilyRepository.delete(id);
  }

  async addMember(id, personId, partyId = null) {
    await this.getById(id, partyId);
    return FamilyRepository.update(id, {
      members: { connect: { id: personId } },
      familySize: { increment: 1 },
    });
  }

  async removeMember(id, personId, partyId = null) {
    await this.getById(id, partyId);
    return FamilyRepository.update(id, {
      members: { disconnect: { id: personId } },
      familySize: { decrement: 1 },
    });
  }
}

module.exports = new FamilyService();
