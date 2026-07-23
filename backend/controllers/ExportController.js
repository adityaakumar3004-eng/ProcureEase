const Product = require("../models/Product");
const exportToCSV = require("../utils/exportCSV");
const exportToExcel = require("../utils/exportExcel");
const exportToPDF = require("../utils/exportPDF");

// Export Products as CSV
const exportProductsCSV = async (req, res, next) => {
    try {
        const result = await Product.getAllProducts(
                 "",
                null,
                null,
                null,
                "name",
                "ASC",
                1,
                100000
            );

const products = result.products;

        const headers = [
            { id: "id", title: "ID" },
            { id: "name", title: "Name" },
            { id: "description", title: "Description" },
            { id: "price", title: "Price" },
            { id: "stock", title: "Stock" },
            { id: "vendor_name", title: "Vendor" },
        ];

        const filePath = await exportToCSV(
            "products.csv",
            headers,
            products
        );

        res.download(filePath);
    } catch (error) {
        next(error);
    }
};

// Export Products as Excel
const exportProductsExcel = async (req, res, next) => {
    try {
        const result = await Product.getAllProducts(
    "",
    null,
    null,
    null,
    "name",
    "ASC",
    1,
    100000
);

const products = result.products;

        const columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "Name", key: "name", width: 30 },
            { header: "Description", key: "description", width: 40 },
            { header: "Price", key: "price", width: 15 },
            { header: "Stock", key: "stock", width: 15 },
            { header: "Vendor", key: "vendor_name", width: 30 },
        ];

        const filePath = await exportToExcel(
            "products.xlsx",
            "Products",
            columns,
            products
        );

        res.download(filePath);
    } catch (error) {
        next(error);
    }
};

// Export Products as PDF
const exportProductsPDF = async (req, res, next) => {
    try {
        const result = await Product.getAllProducts(
    "",
    null,
    null,
    null,
    "name",
    "ASC",
    1,
    100000
);

const products = result.products;

        const filePath = await exportToPDF(
            "products.pdf",
            "Products Report",
            products
        );

        res.download(filePath);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    exportProductsCSV,
    exportProductsExcel,
    exportProductsPDF,
};