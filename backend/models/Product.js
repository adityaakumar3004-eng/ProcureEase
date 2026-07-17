const db = require("../config/db");

// Create Product
const createProduct = async (
    name,
    description,
    price,
    stock,
    vendor_id
) => {
    const [result] = await db.execute(
        `INSERT INTO products
        (name, description, price, stock, vendor_id)
        VALUES (?, ?, ?, ?, ?)`,
        [name, description, price, stock, vendor_id]
    );

    return result;
};

// Get All Products
const getAllProducts = async () => {
    const [rows] = await db.execute(`
        SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock,
            v.name AS vendor_name
        FROM products p
        JOIN vendors v
        ON p.vendor_id = v.id
    `);

    return rows;
};

// Get Product By ID
const getProductById = async (id) => {
    const [rows] = await db.execute(
        "SELECT * FROM products WHERE id = ?",
        [id]
    );

    return rows;
};

// Update Product
const updateProduct = async (
    id,
    name,
    description,
    price,
    stock,
    vendor_id
) => {
    const [result] = await db.execute(
        `UPDATE products
        SET
            name = ?,
            description = ?,
            price = ?,
            stock = ?,
            vendor_id = ?
        WHERE id = ?`,
        [name, description, price, stock, vendor_id, id]
    );

    return result;
};

// Update Product Stock
const updateProductStock = async (id, stock) => {
    const [result] = await db.execute(
        "UPDATE products SET stock = ? WHERE id = ?",
        [stock, id]
    );

    return result;
};

// Delete Product
const deleteProduct = async (id) => {
    const [result] = await db.execute(
        "DELETE FROM products WHERE id = ?",
        [id]
    );

    return result;
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    updateProductStock,
    deleteProduct,
};