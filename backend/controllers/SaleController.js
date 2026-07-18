const db = require("../config/db");
const Sale = require("../models/Sale");
const Product = require("../models/Product");

// Create Sale
const createSale = async (req, res) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const { product_id, quantity } = req.body;

        // Find Product
        const products = await Product.getProductById(
        product_id,
        connection
     );
        if (products.length === 0) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        const product = products[0];

        // Check Stock
        if (product.stock < quantity) {
            return res.status(400).json({
                message: "Insufficient Stock",
            });
        }

        // Calculate Total Amount
        const price = product.price;
        const total_amount = price * quantity;

        // Save Sale
        await Sale.createSale(
            product_id,
            quantity,
            price,
            total_amount,
            connection
        );

        // Update Stock
        const newStock = product.stock - quantity;

        await Product.updateProductStock(
            product_id,
            newStock,
            connection
        );

        // Save all changes permanently
        await connection.commit();

        res.status(201).json({
            message: "Sale recorded successfully",
        });

    } catch (error) {

        // Undo all changes if something goes wrong
        await connection.rollback();

        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });

    } finally {

        // Always release the connection
        connection.release();

    }
};

// Get All Sales
const getAllSales = async (req, res) => {
    try {
        const sales = await Sale.getAllSales();

        res.status(200).json(sales);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = {
    createSale,
    getAllSales,
};