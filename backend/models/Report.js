const db = require("../config/db");

class Report {
    // Sales Report
    static async getSalesReport() {
        const [summary] = await db.query(`
            SELECT
                COUNT(*) AS total_sales,
                IFNULL(SUM(total_amount), 0) AS total_revenue
            FROM sales
        `);

        const [sales] = await db.query(`
               SELECT
               id,
               product_id,
               quantity,
               price,
               total_amount,
               created_at
               FROM sales
               ORDER BY created_at DESC
               `);

        return {
            summary: summary[0],
            sales,
        };
    }

    // Purchase Report
    static async getPurchaseReport() {
        const [summary] = await db.query(`
            SELECT
                COUNT(*) AS total_purchase_orders
            FROM purchase_orders
        `);

        const [statusSummary] = await db.query(`
            SELECT
                status,
                COUNT(*) AS count
            FROM purchase_orders
            GROUP BY status
        `);

        const [purchases] = await db.query(`
                SELECT
                id,
                vendor_id,
                total_amount,
                status,
                created_at
                FROM purchase_orders
                ORDER BY created_at DESC
                `);
        return {
            summary: summary[0],
            statusSummary,
            purchases,
        };
    }

    // Inventory Report
    static async getInventoryReport() {
        const [inventoryValue] = await db.query(`
            SELECT
                IFNULL(SUM(price * stock), 0) AS inventory_value
            FROM products
        `);

        const [lowStock] = await db.query(`
            SELECT
                id,
                name,
                stock
            FROM products
            WHERE stock < 10
            ORDER BY stock ASC
        `);

        const [products] = await db.query(`
            SELECT
                id,
                name,
                stock,
                price
            FROM products
            ORDER BY name
        `);

        return {
            inventoryValue: inventoryValue[0],
            lowStock,
            products,
        };
    }

    // Vendor Report
    static async getVendorReport() {
        const [vendors] = await db.query(`
            SELECT
                v.id,
                v.name,
                COUNT(DISTINCT p.id) AS total_products,
                COUNT(DISTINCT po.id) AS total_purchase_orders
            FROM vendors v
            LEFT JOIN products p
                ON v.id = p.vendor_id
            LEFT JOIN purchase_orders po
                ON v.id = po.vendor_id
            GROUP BY v.id
            ORDER BY v.name
        `);

        return vendors;
    }
}

module.exports = Report;