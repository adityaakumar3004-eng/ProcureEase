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

  const [generatingLowStock, setGeneratingLowStock] =
      useState(false);

  const [generatingPaymentDue, setGeneratingPaymentDue] =
      useState(false);

  const [processingId, setProcessingId] = useState(null);

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
      setGeneratingLowStock(true);

      const response =
          await generateLowStockNotifications();

      alert(
          response.data.message ||
          "Low stock notifications generated successfully."
      );

      await fetchNotifications();
    } catch (error) {
      console.error(error);

      alert(
          error.response?.data?.message ||
          "Failed to generate low stock notifications."
      );
    } finally {
      setGeneratingLowStock(false);
    }
  };

  // ============================================================
  // Generate Payment Due Notifications
  // ============================================================

  const handleGeneratePaymentDue = async () => {
    try {
      setGeneratingPaymentDue(true);

      const response =
          await generatePaymentDueNotifications();

      alert(
          response.data.message ||
          "Payment due notifications generated successfully."
      );

      await fetchNotifications();
    } catch (error) {
      console.error(error);

      alert(
          error.response?.data?.message ||
          "Failed to generate payment due notifications."
      );
    } finally {
      setGeneratingPaymentDue(false);
    }
  };

  // ============================================================
  // Mark As Read
  // ============================================================

  const handleMarkAsRead = async (id) => {
    try {
      setProcessingId(id);

      await markNotificationAsRead(id);

      setNotifications((prev) =>
          prev.map((notification) =>
              notification.id === id
                  ? {
                    ...notification,
                    isRead: true,
                  }
                  : notification
          )
      );
    } catch (error) {
      console.error(error);

      alert(
          error.response?.data?.message ||
          "Failed to mark notification as read."
      );
    } finally {
      setProcessingId(null);
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
      setProcessingId(id);

      await deleteNotification(id);

      setNotifications((prev) =>
          prev.filter(
              (notification) => notification.id !== id
          )
      );
    } catch (error) {
      console.error(error);

      alert(
          error.response?.data?.message ||
          "Failed to delete notification."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ============================================================
  // Search
  // ============================================================

  const filteredNotifications = useMemo(() => {
    const search = searchTerm
        .toLowerCase()
        .trim();

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

  // ============================================================
  // Reset Page When Searching
  // ============================================================

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

  // ============================================================
  // Loading
  // ============================================================

  if (loading) {
    return (
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Loading Notifications...
          </h2>
        </div>
    );
  }

  return (
      <div>

        {/* ====================================================== */}
        {/* Header Actions */}
        {/* ====================================================== */}

        <div className="flex justify-end flex-wrap gap-3 mb-8">

          <button
              onClick={handleGenerateLowStock}
              disabled={generatingLowStock}
              className="px-5 py-2.5 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
          >
            {generatingLowStock
                ? "Generating..."
                : "Generate Low Stock"}
          </button>

          <button
              onClick={handleGeneratePaymentDue}
              disabled={generatingPaymentDue}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium transition shadow-sm"
          >
            {generatingPaymentDue
                ? "Generating..."
                : "Generate Payment Due"}
          </button>

        </div>

        {/* ====================================================== */}
        {/* Search */}
        {/* ====================================================== */}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">

          <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) =>
                  setSearchTerm(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

        </div>

        {/* ====================================================== */}
        {/* Notification Summary */}
        {/* ====================================================== */}

        <div className="mb-5">

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">
            {currentNotifications.length}
          </span>{" "}
            of{" "}
            <span className="font-medium text-gray-700">
            {filteredNotifications.length}
          </span>{" "}
            notifications
          </p>

        </div>

        {/* ====================================================== */}
        {/* Notifications */}
        {/* ====================================================== */}

        <div className="space-y-4">

          {currentNotifications.length === 0 ? (

              <div className="bg-white border border-gray-200 shadow-sm rounded-xl text-center py-12">

                <p className="text-gray-500">
                  No notifications found.
                </p>

              </div>

          ) : (

              currentNotifications.map((notification) => (

                  <div
                      key={notification.id}
                      className={`bg-white rounded-xl border shadow-sm p-5 transition ${
                          notification.isRead
                              ? "border-gray-200"
                              : "border-blue-300"
                      }`}
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                      {/* Notification Content */}

                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-lg font-semibold text-gray-800">
                            {notification.title}
                          </h3>

                          <span className="text-xs bg-gray-100 border border-gray-200 text-gray-600 px-3 py-1 rounded-full">
                      {notification.type}
                    </span>

                          {!notification.isRead && (

                              <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
                        New
                      </span>

                          )}

                        </div>

                        <p className="text-gray-600 mt-3 leading-relaxed">
                          {notification.message}
                        </p>

                        <p className="text-sm text-gray-400 mt-3">
                          {notification.createdAt
                              ? new Date(
                                  notification.createdAt
                              ).toLocaleString()
                              : "-"}
                        </p>

                      </div>

                      {/* Actions */}

                      <div className="flex flex-wrap gap-2 lg:flex-nowrap">

                        {!notification.isRead && (

                            <button
                                onClick={() =>
                                    handleMarkAsRead(
                                        notification.id
                                    )
                                }
                                disabled={
                                    processingId === notification.id
                                }
                                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition whitespace-nowrap"
                            >
                              {processingId === notification.id
                                  ? "Processing..."
                                  : "Mark Read"}
                            </button>

                        )}

                        <button
                            onClick={() =>
                                handleDelete(notification.id)
                            }
                            disabled={
                                processingId === notification.id
                            }
                            className="px-4 py-2 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition whitespace-nowrap"
                        >
                          {processingId === notification.id
                              ? "Processing..."
                              : "Delete"}
                        </button>

                      </div>

                    </div>

                  </div>

              ))

          )}

        </div>

        {/* ====================================================== */}
        {/* Pagination */}
        {/* ====================================================== */}

        {totalPages > 1 && (

            <div className="flex justify-between items-center mt-6">

              <button
                  onClick={() =>
                      setCurrentPage((prev) =>
                          Math.max(prev - 1, 1)
                      )
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              <span className="text-sm font-medium text-gray-600">
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
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>

            </div>

        )}

      </div>
  );
}

export default Notifications;