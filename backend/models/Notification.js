const db = require("../config/db");

// Create Notification
const createNotification = async (title, message, type) => {
    const [result] = await db.execute(
        `INSERT INTO notifications (title, message, type)
         VALUES (?, ?, ?)`,
        [title, message, type]
    );

    return result;
};

// Get All Notifications
const getAllNotifications = async () => {
    const [rows] = await db.execute(
        `SELECT *
         FROM notifications
         ORDER BY created_at DESC`
    );

    return rows;
};

// Mark Notification as Read
const markNotificationAsRead = async (id) => {
    const [result] = await db.execute(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE id = ?`,
        [id]
    );

    return result;
};

// Delete Notification
const deleteNotification = async (id) => {
    const [result] = await db.execute(
        `DELETE FROM notifications
         WHERE id = ?`,
        [id]
    );

    return result;
};

// Check Existing Notification
const checkExistingNotification = async (title, message, type) => {
    const [rows] = await db.execute(
        `SELECT id
         FROM notifications
         WHERE title = ?
         AND message = ?
         AND type = ?
         AND is_read = FALSE`,
        [title, message, type]
    );

    return rows[0];
};

// Create Notification If Not Exists
const createNotificationIfNotExists = async (
    title,
    message,
    type
) => {
    const existingNotification =
        await checkExistingNotification(
            title,
            message,
            type
        );

    if (existingNotification) {
        return false;
    }

    await createNotification(
        title,
        message,
        type
    );

    return true;
};

module.exports = {
    createNotification,
    createNotificationIfNotExists,
    getAllNotifications,
    markNotificationAsRead,
    deleteNotification,
};