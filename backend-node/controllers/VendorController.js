const VendorService = require("../services/VendorService");

// Add Vendor
const addVendor = async (req, res, next) => {
    try {
        const result = await VendorService.addVendor(req.body);

        res.status(201).json({
            success: true,
            message: "Vendor added successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// Get All Vendors
const getVendors = async (req, res, next) => {
    try {
        const vendors = await VendorService.getVendors();

        res.status(200).json({
            success: true,
            data: vendors,
        });
    } catch (error) {
        next(error);
    }
};

// Update Vendor
const updateVendor = async (req, res, next) => {
    try {
        const { id } = req.params;

        await VendorService.updateVendor(id, req.body);

        res.status(200).json({
            success: true,
            message: "Vendor updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Delete Vendor
const deleteVendor = async (req, res, next) => {
    try {
        const { id } = req.params;

        await VendorService.deleteVendor(id);

        res.status(200).json({
            success: true,
            message: "Vendor deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addVendor,
    getVendors,
    updateVendor,
    deleteVendor,
};