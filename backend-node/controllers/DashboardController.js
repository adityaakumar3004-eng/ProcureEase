const Dashboard = require("../models/Dashboard");

const DashboardController = {

getDashboard: async (req, res,next) => {

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

    } 
    catch (error) {
    next(error);
    }
    }, 

getMonthlySales: async (req, res, next) => {
    try {

        const data = await Dashboard.getMonthlySales();

        const formattedData = data.map(item => ({
            ...item,
            sales: Number(item.sales)
        }));

        return res.status(200).json({
            success: true,
            data: formattedData
        });

    } catch (error) {
        next(error);
    }
},

getPurchaseTrends: async (req, res, next) => {
    try {

        const data = await Dashboard.getPurchaseTrends();

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        next(error);
    }
},

getTopProducts: async (req, res, next) => {
    try {

        const data = await Dashboard.getTopProducts();

        const formattedData = data.map(item => ({
            ...item,
            quantity: Number(item.quantity)
        }));

        return res.status(200).json({
            success: true,
            data: formattedData
        });

    } catch (error) {
        next(error);
    }
},

getInventoryDistribution: async (req, res, next) => {
    try {

        const data = await Dashboard.getInventoryDistribution();

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        next(error);
    }
},
};

module.exports = DashboardController;