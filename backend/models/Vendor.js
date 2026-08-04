const db = require("../config/db");

// Create Vendor
const createVendor = async (name, email, phone, address) => {
    const query = `
        INSERT INTO vendors
        (name, email, phone, address)
        VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
        name,
        email,
        phone,
        address,
    ]);

    return result;
};

// Get All Vendors
const getAllVendors = async () => {
    const query = `
        SELECT *
        FROM vendors
    `;

    const [rows] = await db.execute(query);

    return rows;
};

// Find Vendor By Email
const findVendorByEmail = async (email) => {
    const query = `
        SELECT *
        FROM vendors
        WHERE email = ?
    `;

    const [rows] = await db.execute(query, [email]);

    return rows[0];
};

// Update Vendor
const updateVendor = async (
    id,
    name,
    email,
    phone,
    address
) => {
    const query = `
        UPDATE vendors
        SET
            name = ?,
            email = ?,
            phone = ?,
            address = ?
        WHERE id = ?
    `;

    const [result] = await db.execute(query, [
        name,
        email,
        phone,
        address,
        id,
    ]);

    return result;
};

// Delete Vendor
const deleteVendor = async (id) => {
    const query = `
        DELETE FROM vendors
        WHERE id = ?
    `;

    const [result] = await db.execute(query, [id]);

    return result;
};

module.exports = {
    createVendor,
    getAllVendors,
    findVendorByEmail,
    updateVendor,
    deleteVendor,
};