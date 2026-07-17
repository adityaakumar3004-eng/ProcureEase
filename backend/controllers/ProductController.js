const Product = require("../models/Product");

// Create Product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, vendor_id } = req.body;

        const result = await Product.createProduct(
            name,
            description,
            price,
            stock,
            vendor_id
        );

        res.status(201).json({
            message: "Product created successfully",
            productId: result.insertId,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get All Products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.getAllProducts();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, vendor_id } = req.body;

        const result = await Product.updateProduct(
            id,
            name,
            description,
            price,
            stock,
            vendor_id
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Product.deleteProduct(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
};