// services/PersonService.js

const PersonRepository = require("../repositories/PersonRepository");
const Person = require("../models/Person");
const { generateQRCodeBase64, generatePersonPDF } = require("../lib/qrcode");

class PersonService {
  async getAll() {
    return PersonRepository.findAll();
  }

  async getById(id) {
    const person = await PersonRepository.findById(id);
    if (!person) throw new Error("Person não encontrada");
    return person;
  }

  async create({ nome, familyId }) {
    Person.validate({ nome });

    // Cria primeiro para ter o UUID, depois atualiza com o QR
    const created = await PersonRepository.create({ nome: nome.trim(), familyId: familyId || null });
    const qrCodeIMG = await generateQRCodeBase64(created.id);
    return PersonRepository.update(created.id, { qrCodeIMG });
  }

  async update(id, data) {
    await this.getById(id); // garante que existe
    return PersonRepository.update(id, data);
  }

  async delete(id) {
    await this.getById(id);
    return PersonRepository.delete(id);
  }

  async checkin(id) {
    const person = await this.getById(id);
    if (person.isUsed) throw Object.assign(new Error("QR code já utilizado"), { status: 409, person });
    return PersonRepository.update(id, { isUsed: true });
  }

  async getPDF(id) {
    const person = await this.getById(id);
    return generatePersonPDF(person);
  }
}

module.exports = new PersonService();