const { createObjectCsvWriter } = require("csv-writer");
const path = require("path");

const exportToCSV = async (fileName, headers, data) => {
    const filePath = path.join(__dirname, "..", "uploads", fileName);

    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: headers,
    });

    await csvWriter.writeRecords(data);

    return filePath;
};

module.exports = exportToCSV;