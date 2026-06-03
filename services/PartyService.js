const PartyRepository = require("../repositories/PartyRepository");
const Party = require("../models/Party");

class PartyService {
  async getAll() {
    return PartyRepository.findAll();
  }

  async getById(id) {
    const party = await PartyRepository.findById(id);
    if (!party) throw new Error("Party não encontrada");
    return party;
  }

  async create({ titulo, adminId, startDate, endDate, guestIds = [] }) {
    Party.validate({ titulo, adminId, startDate, endDate });
    const duration = Party.calcDuration(startDate, endDate);

    return PartyRepository.create({
      titulo: titulo.trim(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      duration,
      admin: { connect: { id: adminId } },
      ...(guestIds.length > 0 && { guests: { connect: guestIds.map((id) => ({ id })) } }),
    });
  }

  async update(id, { titulo, adminId, startDate, endDate }) {
    const party = await this.getById(id);
    const newStart = startDate ? new Date(startDate) : party.startDate;
    const newEnd = endDate ? new Date(endDate) : party.endDate;
    Party.validate({
      titulo: titulo ?? party.titulo,
      adminId: adminId ?? party.adminId,
      startDate: newStart,
      endDate: newEnd,
    });

    return PartyRepository.update(id, {
      ...(titulo && { titulo: titulo.trim() }),
      ...(adminId && { admin: { connect: { id: adminId } } }),
      startDate: newStart,
      endDate: newEnd,
      duration: Party.calcDuration(newStart, newEnd),
    });
  }

  async delete(id) {
    await this.getById(id);
    return PartyRepository.delete(id);
  }

  async getCheckins(id) {
    const party = await this.getById(id);
    const total = party.guests.length;
    const checkedIn = party.guests.filter((g) => g.isUsed).length;
    return { partyId: party.id, titulo: party.titulo, total, checkedIn, pending: total - checkedIn };
  }

  async addGuest(id, personId) {
    await this.getById(id);
    if (!personId) throw new Error("personId é obrigatório");
    return PartyRepository.update(id, {
      guests: { connect: { id: personId } },
    });
  }

  async removeGuest(id, personId) {
    await this.getById(id);
    return PartyRepository.update(id, {
      guests: { disconnect: { id: personId } },
    });
  }
}

module.exports = new PartyService();