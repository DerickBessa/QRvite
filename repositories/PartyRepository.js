// repositories/PartyRepository.js

const prisma = require("../lib/prisma");

const include = { admin: true, guests: true };

class PartyRepository {
  async findAll() {
    return prisma.party.findMany({ include, orderBy: { createdAt: "desc" } });
  }

  async findById(id) {
    return prisma.party.findUnique({ where: { id }, include });
  }

  async create(data) {
    return prisma.party.create({ data, include });
  }

  async update(id, data) {
    return prisma.party.update({ where: { id }, data, include });
  }

  async delete(id) {
    return prisma.party.delete({ where: { id } });
  }
}

module.exports = new PartyRepository();