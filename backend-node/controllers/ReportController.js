// controllers/ReportController.js

const Report = require("../models/Report");

// Sales Report
const getSalesReport = async (req, res, next) => {
    try {
        const report = await Report.getSalesReport();

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        next(error);
    }
};

// Purchase Report
const getPurchaseReport = async (req, res, next) => {
    try {
        const report = await Report.getPurchaseReport();

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        next(error);
    }
};

// Inventory Report
const getInventoryReport = async (req, res, next) => {
    try {
        const report = await Report.getInventoryReport();

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        next(error);
    }
};

// Vendor Report
const getVendorReport = async (req, res, next) => {
    try {
        const report = await Report.getVendorReport();

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSalesReport,
    getPurchaseReport,
    getInventoryReport,
    getVendorReport,
};