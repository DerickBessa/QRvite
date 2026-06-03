// repositories/FamilyRepository.js

const prisma = require("../lib/prisma");

class FamilyRepository {
  async findAll() {
    return prisma.family.findMany({
      include: { members: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Busca todas as famílias de uma festa específica
  async findByParty(partyId) {
    return prisma.family.findMany({
      where: { partyId },
      include: { members: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Busca família por ID garantindo que pertence à festa informada
  async findById(id, partyId = null) {
    const where = { id };
    if (partyId) where.partyId = partyId;
    return prisma.family.findFirst({
      where,
      include: { members: true },
    });
  }

  async create(data) {
    return prisma.family.create({
      data,
      include: { members: true },
    });
  }

  async update(id, data) {
    return prisma.family.update({
      where: { id },
      data,
      include: { members: true },
    });
  }

  async delete(id) {
    return prisma.family.delete({ where: { id } });
  }
}

module.exports = new FamilyRepository();
