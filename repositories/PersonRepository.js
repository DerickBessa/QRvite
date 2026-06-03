// repositories/PersonRepository.js

const prisma = require("../lib/prisma");

class PersonRepository {
  async findAll() {
    return prisma.person.findMany({
      include: { family: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id) {
    return prisma.person.findUnique({
      where: { id },
      include: { family: true, parties: true },
    });
  }

  async create(data) {
    return prisma.person.create({ data });
  }

  async update(id, data) {
    return prisma.person.update({
      where: { id },
      data,
      include: { family: true },
    });
  }

  async delete(id) {
    return prisma.person.delete({ where: { id } });
  }
}

module.exports = new PersonRepository();