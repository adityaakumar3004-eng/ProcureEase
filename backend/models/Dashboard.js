const db = require("../config/db");

const Dashboard = {

    getTotalVendors: async () => {
        const [rows] = await db.query(
            "SELECT COUNT(*) AS totalVendors FROM vendors"
        );
        return rows[0];
    },

    getTotalProducts: async () => {
        const [rows] = await db.query(
            "SELECT COUNT(*) AS totalProducts FROM products"
        );
        return rows[0];
    },

    getTotalPurchaseOrders: async () => {
        const [rows] = await db.query(
            "SELECT COUNT(*) AS totalPurchaseOrders FROM purchase_orders"
        );
        return rows[0];
    },

    getTotalSales: async () => {
        const [rows] = await db.query(
            "SELECT COUNT(*) AS totalSales FROM sales"
        );
        return rows[0];
    },

   getInventoryValue: async () => {
    const [rows] = await db.query(`
        SELECT COALESCE(SUM(price * stock), 0) AS inventoryValue
        FROM products
    `);

    return rows[0];
    },

    getLowStockProducts: async () => {
        const [rows] = await db.query(
            `SELECT id, name, stock
             FROM products
             WHERE stock < 10
             ORDER BY stock ASC`
            
        );
        return rows;
   },
    getRecentSales: async () => {
        const [rows] = await db.query(
             `SELECT *
             FROM sales
             ORDER BY id DESC
             LIMIT 5`
      );
    return rows;
    },
   getRecentPurchaseOrders: async () => {
    const [rows] = await db.query(`
        SELECT
            id,
            vendor_id,
            total_amount,
            status,
            created_at
        FROM purchase_orders
        ORDER BY id DESC
        LIMIT 5
    `);
    return rows;
    },

};

module.exports = Dashboard;