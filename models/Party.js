// models/Party.js

class Party {
  constructor({ id, titulo, adminId, startDate, endDate, duration, guests = [], createdAt, updatedAt }) {
    this.id = id;
    this.titulo = titulo;
    this.adminId = adminId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.duration = duration;
    this.guests = guests;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static validate({ titulo, adminId, startDate, endDate }) {
    if (!titulo || titulo.trim() === "") throw new Error("titulo é obrigatório");
    if (!adminId) throw new Error("adminId é obrigatório");
    if (!startDate) throw new Error("startDate é obrigatório");
    if (!endDate) throw new Error("endDate é obrigatório");
    if (new Date(endDate) <= new Date(startDate)) throw new Error("endDate deve ser posterior ao startDate");
  }

  static calcDuration(startDate, endDate) {
    return Math.round((new Date(endDate) - new Date(startDate)) / 60000);
  }
}

module.exports = Party;