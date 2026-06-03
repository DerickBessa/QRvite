// services/FamilyService.js

const FamilyRepository = require("../repositories/FamilyRepository");
const Family = require("../models/Family");
const prisma = require("../lib/prisma");

class FamilyService {
  async getAll() {
    return FamilyRepository.findAll();
  }

  async getById(id) {
    const family = await FamilyRepository.findById(id);
    if (!family) throw new Error("Família não encontrada");
    return family;
  }

  async create({ familyName, familySize }) {
    Family.validate({ familyName });
    return FamilyRepository.create({ familyName: familyName.trim(), familySize: familySize || 0 });
  }

  async update(id, data) {
    await this.getById(id);
    return FamilyRepository.update(id, data);
  }

  async delete(id) {
    await this.getById(id);
    // Desvincula membros antes de deletar
    await prisma.person.updateMany({ where: { familyId: id }, data: { familyId: null } });
    return FamilyRepository.delete(id);
  }

  async addMember(id, personId) {
    await this.getById(id);
    return FamilyRepository.update(id, {
      members: { connect: { id: personId } },
      familySize: { increment: 1 },
    });
  }

  async removeMember(id, personId) {
    return FamilyRepository.update(id, {
      members: { disconnect: { id: personId } },
      familySize: { decrement: 1 },
    });
  }
}

module.exports = new FamilyService();