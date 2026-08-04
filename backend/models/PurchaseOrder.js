const db = require("../config/db");
const AppError = require("../utils/AppError");

// Create Purchase Order
const createPurchaseOrder = async (vendor_id, items) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Check Vendor
        const [vendor] = await connection.execute(
            `
            SELECT *
            FROM vendors
            WHERE id = ?
            `,
            [vendor_id]
        );

        if (vendor.length === 0) {
            throw new AppError("Vendor not found", 404);
        }

        let totalAmount = 0;

        // Validate Products & Calculate Total
        for (const item of items) {

            const [product] = await connection.execute(
                `
                SELECT *
                FROM products
                WHERE id = ?
                `,
                [item.product_id]
            );

            if (product.length === 0) {
                throw new AppError(
                    `Product ID ${item.product_id} not found`,
                    404
                );
            }

            if (product[0].stock < item.quantity) {
                throw new AppError(
                    `${product[0].name} has only ${product[0].stock} items in stock`,
                    400
                );
            }

            totalAmount += product[0].price * item.quantity;
        }

        // Create Purchase Order
        const [orderResult] = await connection.execute(
            `
            INSERT INTO purchase_orders
            (vendor_id, total_amount, status)
            VALUES (?, ?, ?)
            `,
            [vendor_id, totalAmount, "Pending"]
        );

        const purchaseOrderId = orderResult.insertId;

        // Insert Items & Reduce Stock
        for (const item of items) {

            const [product] = await connection.execute(
                `
                SELECT *
                FROM products
                WHERE id = ?
                `,
                [item.product_id]
            );

            await connection.execute(
                `
                INSERT INTO purchase_order_items
                (purchase_order_id, product_id, price, quantity)
                VALUES (?, ?, ?, ?)
                `,
                [
                    purchaseOrderId,
                    item.product_id,
                    product[0].price,
                    item.quantity,
                ]
            );

            await connection.execute(
                `
                UPDATE products
                SET stock = stock - ?
                WHERE id = ?
                `,
                [item.quantity, item.product_id]
            );
        }

        await connection.commit();

        return {
            purchaseOrderId,
            totalAmount,
            status: "Pending",
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }
};

// Get All Purchase Orders
const getAllPurchaseOrders = async () => {

    const [rows] = await db.execute(
        `
        SELECT
            po.id,
            v.name AS vendor_name,
            po.total_amount,
            po.status,
            po.created_at,
            po.updated_at
        FROM purchase_orders po
        JOIN vendors v
            ON po.vendor_id = v.id
        ORDER BY po.id DESC
        `
    );

    return rows;
};

// Get Purchase Order By ID
const getPurchaseOrderById = async (id) => {

    const [rows] = await db.execute(
        `
        SELECT
            po.id,
            v.name AS vendor_name,
            p.name AS product_name,
            poi.price,
            poi.quantity,
            (poi.price * poi.quantity) AS subtotal,
            po.total_amount,
            po.status,
            po.created_at
        FROM purchase_orders po
        JOIN vendors v
            ON po.vendor_id = v.id
        JOIN purchase_order_items poi
            ON po.id = poi.purchase_order_id
        JOIN products p
            ON poi.product_id = p.id
        WHERE po.id = ?
        `,
        [id]
    );

    return rows;
};

// Update Purchase Order Status
const updatePurchaseOrderStatus = async (id, status) => {

    const [result] = await db.execute(
        `
        UPDATE purchase_orders
        SET status = ?
        WHERE id = ?
        `,
        [status, id]
    );

    if (result.affectedRows === 0) {
        throw new AppError(
            "Purchase Order not found",
            404
        );
    }

    return result;
};

module.exports = {
    createPurchaseOrder,
    getAllPurchaseOrders,
    getPurchaseOrderById,
    updatePurchaseOrderStatus,
};