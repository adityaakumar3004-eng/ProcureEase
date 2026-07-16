const db = require("../config/db");

// Create Vendor
const createVendor = async (name, email, phone, address) => {
    const [result] = await db.execute(
        "INSERT INTO vendors (name, email, phone, address) VALUES (?, ?, ?, ?)",
        [name, email, phone, address]
    );

    return result;
};

// Get All Vendors
const getAllVendors = async () => {
    const [rows] = await db.execute("SELECT * FROM vendors");
    return rows;
};

// Update Vendor
const updateVendor = async (id, name, email, phone, address) => {
    const [result] = await db.execute(
        "UPDATE vendors SET name=?, email=?, phone=?, address=? WHERE id=?",
        [name, email, phone, address, id]
    );

    return result;
};

// Delete Vendor
const deleteVendor = async (id) => {
    const [result] = await db.execute(
        "DELETE FROM vendors WHERE id=?",
        [id]
    );

    return result;
};

module.exports = {
    createVendor,
    getAllVendors,
    updateVendor,
    deleteVendor
};