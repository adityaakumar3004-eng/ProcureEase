const VendorService = require("../services/VendorService");

// Add Vendor
const addVendor = async (req, res) => {
    try {
        const result = await VendorService.addVendor(req.body);

        res.status(201).json({
            success: true,
            message: "Vendor added successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Vendors
const getVendors = async (req, res) => {
    try {
        const vendors = await VendorService.getVendors();

        res.status(200).json({
            success: true,
            data: vendors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Vendor
const updateVendor = async (req, res) => {
    try {
        const { id } = req.params;

        await VendorService.updateVendor(id, req.body);

        res.status(200).json({
            success: true,
            message: "Vendor updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Vendor
const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;

        await VendorService.deleteVendor(id);

        res.status(200).json({
            success: true,
            message: "Vendor deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addVendor,
    getVendors,
    updateVendor,
    deleteVendor
};