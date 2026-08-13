const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const exportToPDF = (fileName, title, data) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, "..", "uploads", fileName);

        const doc = new PDFDocument();

        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        doc.fontSize(20).text(title, {
            align: "center",
        });

        doc.moveDown();

        data.forEach((item) => {
            Object.keys(item).forEach((key) => {
                doc.fontSize(12).text(`${key}: ${item[key]}`);
            });

            doc.moveDown();
        });

        doc.end();

        stream.on("finish", () => resolve(filePath));

        stream.on("error", reject);
    });
};

module.exports = exportToPDF;