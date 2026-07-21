const Product = require("../models/Product");
const AppError = require("../utils/AppError");

// Create Product
const createProduct = async (req, res, next) => {
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
    }catch (error) {
    next(error);
}
};

// Get All Products
const getAllProducts = async (req, res, next) => {
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
    next(error);
}
};

// Update Product
const updateProduct = async (req, res,next) => {
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
    return next(new AppError("Product not found", 404));
}

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
        });
    } catch (error) {
    next(error);
}
};

// Delete Product
const deleteProduct = async (req, res,next) => {
    try {
        const { id } = req.params;

        const result = await Product.deleteProduct(id);

    if (result.affectedRows === 0) {
    return next(new AppError("Product not found", 404));
}

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
    next(error);
}
};

module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
};