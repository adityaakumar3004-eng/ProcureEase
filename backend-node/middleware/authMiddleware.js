const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    // Get Authorization header
    const authHeader = req.header("Authorization");

    // Check if header exists
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided."
        });
    }

    // Check if header starts with Bearer
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Invalid token format."
        });
    }

    // Extract only the JWT
    const token = authHeader.split(" ")[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        req.user = verified;

        next();

    } 
    catch (err) {
    return res.status(401).json({
        success: false,
        message: "Invalid or expired token."
    });
    }
};