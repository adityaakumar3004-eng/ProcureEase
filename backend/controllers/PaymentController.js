const Payment = require("../models/Payment");

// Get All Payments
const getAllPayments = async (req, res, next) => {
    try {
        const payments = await Payment.getAllPayments();

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPayments,
};