// repositories/FamilyRepository.js

const prisma = require("../lib/prisma");

class FamilyRepository {
  // Busca global — sem filtro de festa (usada nas rotas independentes)
  async findAll() {
    return prisma.family.findMany({
      include: { members: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Busca filtrada por festa
  async findByParty(partyId) {
    return prisma.family.findMany({
      where: { partyId },
      include: { members: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Busca família por ID, opcionalmente filtrando por festa
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