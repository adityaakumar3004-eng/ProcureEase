import { useEffect, useMemo, useState } from "react";

import {
  getNotifications,
  generateLowStockNotifications,
  generatePaymentDueNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../services/notificationService";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const notificationsPerPage = 5;

  // ============================================================
  // Fetch Notifications
  // ============================================================

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await getNotifications();

      console.log("Notifications:", response.data);

      // Backend response:
      // {
      //   success: true,
      //   count: ...,
      //   data: [...]
      // }

      setNotifications(response.data.data || []);

    } catch (error) {
      console.error(
          "Error fetching notifications:",
          error
      );

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Generate Low Stock Notifications
  // ============================================================

  const handleGenerateLowStock = async () => {
    try {
      const response =
          await generateLowStockNotifications();

      alert(
          response.data.message ||
          "Low stock notifications generated."
      );

      await fetchNotifications();

    } catch (error) {
      console.error(error);

      alert(
          error.response?.data?.message ||
          "Failed to generate low stock notifications."
      );
    }
  };

  // ============================================================
  // Generate Payment Due Notifications
  // ============================================================

  const handleGeneratePaymentDue = async () => {
    try {
      const response =
          await generatePaymentDueNotifications();

      alert(
          response.data.message ||
          "Payment due notifications generated."
      );

      await fetchNotifications();

    } catch (error) {
      console.error(error);

      alert(
          error.response?.data?.message ||
          "Failed to generate payment due notifications."
      );
    }
  };

  // ============================================================
  // Mark As Read
  // ============================================================

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);

      await fetchNotifications();

    } catch (error) {
      console.error(error);

      alert(
          error.response?.data?.message ||
          "Failed to mark notification as read."
      );
    }
  };

  // ============================================================
  // Delete Notification
  // ============================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this notification?"
    );

    if (!confirmDelete) return;

    try {
      await deleteNotification(id);

      await fetchNotifications();

    } catch (error) {
      console.error(error);

      alert(
          error.response?.data?.message ||
          "Failed to delete notification."
      );
    }
  };

  // ============================================================
  // Search
  // ============================================================

  const filteredNotifications = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return notifications.filter((notification) => {
      return (
          notification.title
              ?.toLowerCase()
              .includes(search) ||

          notification.message
              ?.toLowerCase()
              .includes(search) ||

          notification.type
              ?.toLowerCase()
              .includes(search)
      );
    });
  }, [notifications, searchTerm]);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ============================================================
  // Pagination
  // ============================================================

  const indexOfLastNotification =
      currentPage * notificationsPerPage;

  const indexOfFirstNotification =
      indexOfLastNotification -
      notificationsPerPage;

  const currentNotifications =
      filteredNotifications.slice(
          indexOfFirstNotification,
          indexOfLastNotification
      );

  const totalPages = Math.ceil(
      filteredNotifications.length /
      notificationsPerPage
  );

  if (loading) {
    return <h2>Loading Notifications...</h2>;
  }

  return (
      <div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">
            Notifications
          </h1>

          <div className="flex gap-3">

            <button
                onClick={handleGenerateLowStock}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
            >
              Generate Low Stock
            </button>

            <button
                onClick={handleGeneratePaymentDue}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Generate Payment Due
            </button>

          </div>

        </div>

        {/* Search */}
        <div className="mb-6">

          <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) =>
                  setSearchTerm(e.target.value)
              }
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Notifications */}
        <div className="space-y-4">

          {currentNotifications.length === 0 ? (

              <div className="text-center py-10 text-gray-500">
                No notifications found.
              </div>

          ) : (

              currentNotifications.map((notification) => (

                  <div
                      key={notification.id}
                      className={`border rounded-lg p-4 flex justify-between items-center ${
                          notification.isRead
                              ? "bg-white"
                              : "bg-blue-50 border-blue-200"
                      }`}
                  >

                    <div>

                      <div className="flex items-center gap-3">

                        <h3 className="font-semibold text-lg">
                          {notification.title}
                        </h3>

                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {notification.type}
                  </span>

                        {!notification.isRead && (
                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                      New
                    </span>
                        )}

                      </div>

                      <p className="text-gray-600 mt-2">
                        {notification.message}
                      </p>

                      <p className="text-sm text-gray-400 mt-2">
                        {notification.createdAt
                            ? new Date(
                                notification.createdAt
                            ).toLocaleString()
                            : ""}
                      </p>

                    </div>

                    <div className="flex gap-2 ml-4">

                      {!notification.isRead && (

                          <button
                              onClick={() =>
                                  handleMarkAsRead(
                                      notification.id
                                  )
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
                          >
                            Mark Read
                          </button>

                      )}

                      <button
                          onClick={() =>
                              handleDelete(notification.id)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

              ))

          )}

        </div>

        {/* Pagination */}
        {totalPages > 1 && (

            <div className="flex justify-between items-center mt-6">

              <button
                  onClick={() =>
                      setCurrentPage((prev) =>
                          Math.max(prev - 1, 1)
                      )
                  }
                  disabled={currentPage === 1}
                  className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 px-4 py-2 rounded"
              >
                Previous
              </button>

              <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>

              <button
                  onClick={() =>
                      setCurrentPage((prev) =>
                          Math.min(
                              prev + 1,
                              totalPages
                          )
                      )
                  }
                  disabled={
                      currentPage === totalPages
                  }
                  className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 px-4 py-2 rounded"
              >
                Next
              </button>

            </div>

        )}

      </div>
  );
}

export default Notifications;