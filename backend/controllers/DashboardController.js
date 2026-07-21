const Dashboard = require("../models/Dashboard");

const DashboardController = {

    getDashboard: async (req, res) => {

        try {

          const [
                 vendors,
                 products,
                 purchaseOrders,
                 sales,
                 inventoryValue,
                 lowStockProducts,
                 recentSales,
                 recentPurchaseOrders
                ] = await Promise.all([
                 Dashboard.getTotalVendors(),
                 Dashboard.getTotalProducts(),
                 Dashboard.getTotalPurchaseOrders(),
                 Dashboard.getTotalSales(),
                 Dashboard.getInventoryValue(),
                 Dashboard.getLowStockProducts(),
                 Dashboard.getRecentSales(),
                 Dashboard.getRecentPurchaseOrders()
                ]);

            return res.status(200).json({
                vendors: vendors.totalVendors,
                products: products.totalProducts,
                purchaseOrders: purchaseOrders.totalPurchaseOrders,
                sales: sales.totalSales,
                inventoryValue: Number(inventoryValue.inventoryValue),
                lowStockProducts,
                recentSales,
                recentPurchaseOrders
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Error fetching dashboard data"
            });

        }

    }

};

module.exports = DashboardController;