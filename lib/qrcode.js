// lib/qrcode.js

const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");

/**
 * Gera QR code como base64 (data URL) a partir de um texto/UUID
 * @param {string} text - Conteúdo do QR code (normalmente o UUID da Person)
 * @returns {Promise<string>} base64 data URL
 */
async function generateQRCodeBase64(text) {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 300,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return dataUrl;
  } catch (err) {
    throw new Error(`Erro ao gerar QR code: ${err.message}`);
  }
}

/**
 * Gera QR code como Buffer PNG
 * @param {string} text
 * @returns {Promise<Buffer>}
 */
async function generateQRCodeBuffer(text) {
  try {
    const buffer = await QRCode.toBuffer(text, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 300,
    });
    return buffer;
  } catch (err) {
    throw new Error(`Erro ao gerar QR code buffer: ${err.message}`);
  }
}

/**
 * Gera um PDF com o QR code e nome da pessoa
 * @param {Object} person - { nome, qrCodeIMG, id }
 * @returns {Promise<Buffer>} PDF como buffer
 */
async function generatePersonPDF(person) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Header
      doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("TáNaLista", { align: "center" });

      doc.moveDown(0.5);

      doc
        .fontSize(12)
        .font("Helvetica")
        .fillColor("#666666")
        .text("Convite de Acesso", { align: "center" });

      doc.moveDown(1);

      // Linha separadora
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .strokeColor("#e5e7eb")
        .lineWidth(1)
        .stroke();

      doc.moveDown(1);

      // Nome da pessoa
      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .fillColor("#111111")
        .text(person.nome, { align: "center" });

      doc.moveDown(1.5);

      // QR Code
      // qrCodeIMG é base64 data URL — converter para buffer
      let qrBuffer;
      if (person.qrCodeIMG && person.qrCodeIMG.startsWith("data:image/png;base64,")) {
        const base64Data = person.qrCodeIMG.replace("data:image/png;base64,", "");
        qrBuffer = Buffer.from(base64Data, "base64");
      } else {
        // Gerar novo caso não exista
        qrBuffer = await generateQRCodeBuffer(person.id);
      }

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const imgSize = 200;
      const imgX = doc.page.margins.left + (pageWidth - imgSize) / 2;

      doc.image(qrBuffer, imgX, doc.y, {
        width: imgSize,
        height: imgSize,
      });

      doc.moveDown(imgSize / 12 + 1);

      // ID do convite
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#9ca3af")
        .text(`ID: ${person.id}`, { align: "center" });

      doc.moveDown(2);

      // Rodapé
      doc
        .fontSize(10)
        .fillColor("#6b7280")
        .text("Apresente este QR code na entrada do evento.", { align: "center" });

      doc.end();
    } catch (err) {
      reject(new Error(`Erro ao gerar PDF: ${err.message}`));
    }
  });
}

module.exports = {
  generateQRCodeBase64,
  generateQRCodeBuffer,
  generatePersonPDF,
};