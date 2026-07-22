const db = require("../config/db");

// Create Product
const createProduct = async (
    name,
    description,
    price,
    stock,
    vendor_id,
    image
) => {
    const [result] = await db.execute(
        `INSERT INTO products
        (name, description, price, stock, vendor_id,image)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [name, description, price, stock, vendor_id,image]
    );

    return result;
};

// Get All Products
const getAllProducts = async (
    search,
    vendor_id,
    minPrice,
    maxPrice,
    sortBy,
    order,
    page,
    limit
) => {

    let query = `
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
        WHERE 1=1
    `;

    let values = [];

    if (search) {
        query += ` AND p.name LIKE ?`;
        values.push(`%${search}%`);
    }

    if (vendor_id) {
        query += ` AND p.vendor_id = ?`;
        values.push(vendor_id);
    }
    if (minPrice) {
    query += ` AND p.price >= ?`;
    values.push(minPrice);
    }
    if (maxPrice) {
    query += ` AND p.price <= ?`;
    values.push(maxPrice);
    }
    const allowedSortFields = [
    "name",
    "price",
    "stock"
    ];
    const sortField = allowedSortFields.includes(sortBy)
    ? sortBy
    : "name";
    const sortOrder = order === "DESC"
    ? "DESC"
    : "ASC";

    query += ` ORDER BY p.${sortField} ${sortOrder}`;

    const countValues = [...values];

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const offset = (pageNumber - 1) * limitNumber;

    query += ` LIMIT ? OFFSET ?`;

    values.push(limitNumber, offset);

    const countQuery = `
    SELECT COUNT(*) AS total
    FROM products p
    WHERE 1=1
    `;

   let finalCountQuery = countQuery;

   if (search) {
    finalCountQuery += ` AND p.name LIKE ?`;
    }

    if (vendor_id) {
    finalCountQuery += ` AND p.vendor_id = ?`;
    }

    if (minPrice) {
    finalCountQuery += ` AND p.price >= ?`;
    }

    if (maxPrice) {
    finalCountQuery += ` AND p.price <= ?`;
    }

    const [rows] = await db.query(query, values);

    const [countRows] = await db.query(
    finalCountQuery,
    countValues
    );

    return {
    products: rows,
    total: countRows[0].total
    };
};

// Get Product By ID
const getProductById = async (
    id,
    connection = db
) => {
    const [rows] = await connection.execute(
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
const updateProductStock = async (
    id,
    stock,
    connection = db
) => {
    const [result] = await connection.execute(
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