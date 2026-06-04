// services/FamilyService.js

const FamilyRepository = require("../repositories/FamilyRepository");
const Family = require("../models/Family");
const { generateQRCodeBase64, generateFamilyPDF } = require("../lib/qrcode");
const prisma = require("../lib/prisma");

class FamilyService {
  // Listagem global (sem partyId — usada pela HomePage)
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

  // Criação independente (sem partyId obrigatório — usada pela HomePage)
  async create({ familyName, partyId }) {
    Family.validate({ familyName });

    // Cria a família primeiro para obter o UUID
    const created = await FamilyRepository.create({
      familyName: familyName.trim(),
      familySize: 0,
      ...(partyId ? { party: { connect: { id: partyId } } } : {}),
    });

    // Gera o QR code apontando para o ID da família
    const qrCodeIMG = await generateQRCodeBase64(created.id);
    return FamilyRepository.update(created.id, { qrCodeIMG });
  }

  async update(id, data, partyId = null) {
    await this.getById(id, partyId);
    return FamilyRepository.update(id, data);
  }

  async delete(id, partyId = null) {
    await this.getById(id, partyId);
    // Desvincula membros mas não os remove
    await prisma.person.updateMany({ where: { familyId: id }, data: { familyId: null } });
    return FamilyRepository.delete(id);
  }

  async addMember(id, personId, partyId = null) {
    await this.getById(id, partyId);
    const updated = await FamilyRepository.update(id, {
      members: { connect: { id: personId } },
      familySize: { increment: 1 },
    });
    return updated;
  }

  async removeMember(id, personId, partyId = null) {
    await this.getById(id, partyId);
    const updated = await FamilyRepository.update(id, {
      members: { disconnect: { id: personId } },
      familySize: { decrement: 1 },
    });
    return updated;
  }

  // Regenera o QR Code da família (o conteúdo é sempre o ID da família —
  // o QR aponta para /convite/familia/:id que busca os membros em tempo real)
  async regenerateQR(id) {
    const family = await this.getById(id);
    const qrCodeIMG = await generateQRCodeBase64(family.id);
    return FamilyRepository.update(id, { qrCodeIMG });
  }

  async getPDF(id) {
    const family = await this.getById(id);
    return generateFamilyPDF(family);
  }
}

module.exports = new FamilyService();