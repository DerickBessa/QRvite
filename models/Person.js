class Person {
  constructor({ id, nome, qrCodeIMG = null, isUsed = false, familyId = null, createdAt, updatedAt }) {
    this.id = id;
    this.nome = nome;
    this.qrCodeIMG = qrCodeIMG;
    this.isUsed = isUsed;
    this.familyId = familyId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
 
  static validate({ nome }) {
    if (!nome || nome.trim() === "") throw new Error("nome é obrigatório");
  }
}
 
module.exports = Person;