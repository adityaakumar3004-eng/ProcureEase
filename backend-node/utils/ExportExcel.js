const ExcelJS = require("exceljs");
const path = require("path");

const exportToExcel = async (fileName, sheetName, columns, data) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns;

    worksheet.addRows(data);

    const filePath = path.join(__dirname, "..", "uploads", fileName);

    await workbook.xlsx.writeFile(filePath);

    return filePath;
};

module.exports = exportToExcel;