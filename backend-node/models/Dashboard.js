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
    getMonthlySales: async () => {
     const [rows] = await db.query(`
        SELECT
            MONTH(created_at) AS monthNumber,
            MONTHNAME(created_at) AS month,
            COALESCE(SUM(total_amount), 0) AS sales
            FROM sales
            GROUP BY MONTH(created_at), MONTHNAME(created_at)
            ORDER BY monthNumber
        `);

        return rows;
    },
    getPurchaseTrends: async () => {
    const [rows] = await db.query(`
         SELECT
            MONTH(created_at) AS monthNumber,
            MONTHNAME(created_at) AS month,
            COUNT(*) AS purchases
            FROM purchase_orders
            GROUP BY MONTH(created_at), MONTHNAME(created_at)
            ORDER BY monthNumber
        `);

        return rows;
    },
    getTopProducts: async () => {
    const [rows] = await db.query(`
         SELECT
            p.name AS product,
            COALESCE(SUM(s.quantity), 0) AS quantity
            FROM sales s
            INNER JOIN products p
            ON s.product_id = p.id
            GROUP BY p.id, p.name
            ORDER BY quantity DESC
            LIMIT 5
        `);

        return rows;
    },
        getInventoryDistribution: async () => {
        const [rows] = await db.query(`
            SELECT
                CASE
                    WHEN stock < 10 THEN 'Low Stock'
                    ELSE 'Healthy Stock'
                END AS category,
                COUNT(*) AS count
            FROM products
            GROUP BY category
        `);

        return rows;
    },

};

module.exports = Dashboard;