// models/Family.js

class Family {
  constructor({ id, familyName, familySize = 0, members = [], createdAt, updatedAt }) {
    this.id = id;
    this.familyName = familyName;
    this.familySize = familySize;
    this.members = members;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static validate({ familyName }) {
    if (!familyName || familyName.trim() === "") throw new Error("familyName é obrigatório");
  }
}

module.exports = Family;