// repositories/FamilyRepository.js

const prisma = require("../lib/prisma");

class FamilyRepository {
  async findAll() {
    return prisma.family.findMany({
      include: { members: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id) {
    return prisma.family.findUnique({
      where: { id },
      include: { members: true },
    });
  }

  async create(data) {
    return prisma.family.create({ data });
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