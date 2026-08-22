import api from "./api";

// ===============================
// Sales Report
// ===============================

export const getSalesReport = async () => {
    const response = await api.get(
        "/reports/sales"
    );

    return response.data;
};

// ===============================
// Purchase Report
// ===============================

export const getPurchaseReport = async () => {
    const response = await api.get(
        "/reports/purchases"
    );

    return response.data;
};

// ===============================
// Inventory Report
// ===============================

export const getInventoryReport = async () => {
    const response = await api.get(
        "/reports/inventory"
    );

    return response.data;
};

// ===============================
// Vendor Report
// ===============================

export const getVendorReport = async () => {
    const response = await api.get(
        "/reports/vendors"
    );

    return response.data;
};