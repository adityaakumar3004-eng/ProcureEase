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
        const {
                search = "",
                vendor_id,
                minPrice,
                maxPrice,
                sortBy,
                order,
                page = 1,
                limit = 10
              } = req.query;

        const result = await Product.getAllProducts(
                search,
                vendor_id,
                minPrice,
                maxPrice,
                sortBy,
                order,
                page,
                limit
              );
       const totalPages = Math.ceil(result.total / Number(limit));

             res.status(200).json({
             success: true,
             page: Number(page),
             limit: Number(limit),
             total: result.total,
             totalPages,
             data: result.products
});
    } catch (error) {
        res.status(500).json({
            message: "Error fetching products",
            error: error.message
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