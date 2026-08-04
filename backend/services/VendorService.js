const AppError = require("../utils/AppError");
const Vendor = require("../models/Vendor");

// Add Vendor
const addVendor = async (vendorData) => {
    const { name, email, phone, address } = vendorData;

    const existingVendor =
        await Vendor.findVendorByEmail(email);

    if (existingVendor) {
        throw new AppError(
            "Vendor with this email already exists.",
            400
        );
    }

    return await Vendor.createVendor(
        name,
        email,
        phone,
        address
    );
};

// Get All Vendors
const getVendors = async () => {
    return await Vendor.getAllVendors();
};

// Update Vendor
const updateVendor = async (id, vendorData) => {
    const { name, email, phone, address } = vendorData;

    return await Vendor.updateVendor(id, name, email, phone, address);
};

// Delete Vendor
const deleteVendor = async (id) => {
    return await Vendor.deleteVendor(id);
};

module.exports = {
    addVendor,
    getVendors,
    updateVendor,
    deleteVendor
};