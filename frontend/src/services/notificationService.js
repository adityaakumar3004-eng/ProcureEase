import api from "./api";

// ============================================================
// Get All Notifications
// ============================================================

export const getNotifications = async () => {
    return await api.get("/notifications");
};


// ============================================================
// Generate Low Stock Notifications
// ============================================================

export const generateLowStockNotifications = async () => {
    return await api.post("/notifications/low-stock");
};


// ============================================================
// Generate Payment Due Notifications
// ============================================================

export const generatePaymentDueNotifications = async () => {
    return await api.post("/notifications/payment-due");
};


// ============================================================
// Mark Notification As Read
// ============================================================

export const markNotificationAsRead = async (id) => {
    return await api.put(`/notifications/${id}/read`);
};


// ============================================================
// Delete Notification
// ============================================================

export const deleteNotification = async (id) => {
    return await api.delete(`/notifications/${id}`);
};