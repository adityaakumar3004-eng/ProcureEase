import { useState } from "react";

import {
  getSalesReport,
  getPurchaseReport,
  getInventoryReport,
  getVendorReport,
} from "../services/reportService";

function Reports() {
  const [activeReport, setActiveReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================
  // Load Sales Report
  // =====================================

  const handleSalesReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSalesReport();

      setReportData(response.data);
      setActiveReport("sales");
    } catch (error) {
      console.error(error);
      setError("Failed to load sales report");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Load Purchase Report
  // =====================================

  const handlePurchaseReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPurchaseReport();

      setReportData(response.data);
      setActiveReport("purchase");
    } catch (error) {
      console.error(error);
      setError("Failed to load purchase report");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Load Inventory Report
  // =====================================

  const handleInventoryReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getInventoryReport();

      setReportData(response.data);
      setActiveReport("inventory");
    } catch (error) {
      console.error(error);
      setError("Failed to load inventory report");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Load Vendor Report
  // =====================================

  const handleVendorReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getVendorReport();

      setReportData(response.data);
      setActiveReport("vendor");
    } catch (error) {
      console.error(error);
      setError("Failed to load vendor report");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div>
        {/* Report Buttons */}

        <div className="flex flex-wrap gap-4 mb-8">
          <button
              onClick={handleSalesReport}
              className={`px-5 py-3 rounded-lg font-medium transition ${
                  activeReport === "sales"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-blue-200 text-blue-800 hover:bg-blue-50"
              }`}
          >
            Sales Report
          </button>

          <button
              onClick={handlePurchaseReport}
              className={`px-5 py-3 rounded-lg font-medium transition ${
                  activeReport === "purchase"
                      ? "bg-green-600 text-white"
                      : "bg-white border border-green-200 text-green-800 hover:bg-green-50"
              }`}
          >
            Purchase Report
          </button>

          <button
              onClick={handleInventoryReport}
              className={`px-5 py-3 rounded-lg font-medium transition ${
                  activeReport === "inventory"
                      ? "bg-purple-600 text-white"
                      : "bg-white border border-purple-200 text-purple-800 hover:bg-purple-50"
              }`}
          >
            Inventory Report
          </button>

          <button
              onClick={handleVendorReport}
              className={`px-5 py-3 rounded-lg font-medium transition ${
                  activeReport === "vendor"
                      ? "bg-orange-500 text-white"
                      : "bg-white border border-orange-200 text-orange-800 hover:bg-orange-50"
              }`}
          >
            Vendor Report
          </button>
        </div>

        {/* Loading */}

        {loading && (
            <p className="text-lg text-gray-600">
              Loading report...
            </p>
        )}

        {/* Error */}

        {error && (
            <p className="text-red-500">
              {error}
            </p>
        )}

        {/* ================================= */}
        {/* SALES REPORT */}
        {/* ================================= */}

        {!loading &&
            activeReport === "sales" &&
            reportData && (
                <div>
                  {/* Summary Cards */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                      <p className="text-gray-500">
                        Total Sales
                      </p>

                      <h2 className="text-3xl font-bold text-gray-800 mt-2">
                        {reportData.summary?.totalSales ?? 0}
                      </h2>
                    </div>

                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                      <p className="text-gray-500">
                        Total Revenue
                      </p>

                      <h2 className="text-3xl font-bold text-gray-800 mt-2">
                        ₹
                        {Number(
                            reportData.summary?.totalRevenue ?? 0
                        ).toLocaleString()}
                      </h2>
                    </div>
                  </div>

                  {/* Sales Table */}

                  <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          Sale ID
                        </th>

                        <th className="px-6 py-4 text-left">
                          Product
                        </th>

                        <th className="px-6 py-4 text-left">
                          Quantity
                        </th>

                        <th className="px-6 py-4 text-left">
                          Price
                        </th>

                        <th className="px-6 py-4 text-left">
                          Total Amount
                        </th>

                        <th className="px-6 py-4 text-left">
                          Date
                        </th>
                      </tr>
                      </thead>

                      <tbody>
                      {reportData.sales?.map((sale) => (
                          <tr
                              key={sale.id}
                              className="border-t hover:bg-gray-50"
                          >
                            <td className="px-6 py-4">
                              #{sale.id}
                            </td>

                            <td className="px-6 py-4 font-medium">
                              {sale.productName}
                            </td>

                            <td className="px-6 py-4">
                              {sale.quantity}
                            </td>

                            <td className="px-6 py-4">
                              ₹{Number(sale.price).toLocaleString()}
                            </td>

                            <td className="px-6 py-4">
                              ₹{Number(sale.totalAmount).toLocaleString()}
                            </td>

                            <td className="px-6 py-4">
                              {sale.createdAt
                                  ? new Date(
                                      sale.createdAt
                                  ).toLocaleDateString()
                                  : "-"}
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            )}

        {/* ================================= */}
        {/* PURCHASE REPORT */}
        {/* ================================= */}

        {!loading &&
            activeReport === "purchase" &&
            reportData && (
                <div>
                  {/* Summary */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                      <p className="text-gray-500">
                        Total Purchase Orders
                      </p>

                      <h2 className="text-3xl font-bold text-gray-800 mt-2">
                        {reportData.summary
                            ?.totalPurchaseOrders ?? 0}
                      </h2>
                    </div>
                  </div>

                  {/* Status Summary */}

                  <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">
                      Purchase Status Summary
                    </h2>

                    <div className="flex flex-wrap gap-4">
                      {reportData.statusSummary?.map(
                          (item) => (
                              <div
                                  key={item.status}
                                  className="border border-gray-200 rounded-xl px-5 py-4 min-w-[150px]"
                              >
                                <p className="text-gray-500">
                                  {item.status}
                                </p>

                                <p className="text-2xl font-bold text-gray-800 mt-2">
                                  {item.count}
                                </p>
                              </div>
                          )
                      )}
                    </div>
                  </div>

                  {/* Purchase Table */}

                  <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          PO ID
                        </th>

                        <th className="px-6 py-4 text-left">
                          Vendor ID
                        </th>

                        <th className="px-6 py-4 text-left">
                          Total Amount
                        </th>

                        <th className="px-6 py-4 text-left">
                          Status
                        </th>

                        <th className="px-6 py-4 text-left">
                          Created Date
                        </th>
                      </tr>
                      </thead>

                      <tbody>
                      {reportData.purchases?.map(
                          (purchase) => (
                              <tr
                                  key={purchase.id}
                                  className="border-t hover:bg-gray-50"
                              >
                                <td className="px-6 py-4">
                                  #{purchase.id}
                                </td>

                                <td className="px-6 py-4">
                                  {purchase.vendorId}
                                </td>

                                <td className="px-6 py-4">
                                  ₹
                                  {Number(
                                      purchase.totalAmount
                                  ).toLocaleString()}
                                </td>

                                <td className="px-6 py-4">
                          <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                  purchase.status === "Approved"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {purchase.status}
                          </span>
                                </td>

                                <td className="px-6 py-4">
                                  {purchase.createdAt
                                      ? new Date(
                                          purchase.createdAt
                                      ).toLocaleDateString()
                                      : "-"}
                                </td>
                              </tr>
                          )
                      )}
                      </tbody>
                    </table>
                  </div>
                </div>
            )}

        {/* ================================= */}
        {/* INVENTORY REPORT */}
        {/* ================================= */}

        {!loading &&
            activeReport === "inventory" &&
            reportData && (
                <div>
                  {/* Summary Cards */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                      <p className="text-gray-500">
                        Total Inventory Value
                      </p>

                      <h2 className="text-3xl font-bold text-gray-800 mt-2">
                        ₹
                        {Number(
                            reportData.inventoryValue
                                ?.inventoryValue ?? 0
                        ).toLocaleString()}
                      </h2>
                    </div>

                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                      <p className="text-gray-500">
                        Low Stock Products
                      </p>

                      <h2 className="text-3xl font-bold text-gray-800 mt-2">
                        {reportData.lowStock?.length ?? 0}
                      </h2>
                    </div>
                  </div>

                  {/* Low Stock */}

                  <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-x-auto mb-8">
                    <h2 className="text-xl font-bold p-6">
                      Low Stock Products
                    </h2>

                    {reportData.lowStock?.length === 0 ? (
                        <p className="text-gray-500 px-6 pb-6">
                          No low stock products.
                        </p>
                    ) : (
                        <table className="min-w-full">
                          <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left">
                              Product ID
                            </th>

                            <th className="px-6 py-4 text-left">
                              Product Name
                            </th>

                            <th className="px-6 py-4 text-left">
                              Stock
                            </th>
                          </tr>
                          </thead>

                          <tbody>
                          {reportData.lowStock?.map(
                              (product) => (
                                  <tr
                                      key={product.id}
                                      className="border-t hover:bg-gray-50"
                                  >
                                    <td className="px-6 py-4">
                                      #{product.id}
                                    </td>

                                    <td className="px-6 py-4 font-medium">
                                      {product.name}
                                    </td>

                                    <td className="px-6 py-4">
                            <span className="bg-yellow-50 text-gray-800 px-3 py-1 rounded-full">
                              {product.stock}
                            </span>
                                    </td>
                                  </tr>
                              )
                          )}
                          </tbody>
                        </table>
                    )}
                  </div>

                  {/* Inventory Products */}

                  <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          Product ID
                        </th>

                        <th className="px-6 py-4 text-left">
                          Product Name
                        </th>

                        <th className="px-6 py-4 text-left">
                          Stock
                        </th>

                        <th className="px-6 py-4 text-left">
                          Price
                        </th>

                        <th className="px-6 py-4 text-left">
                          Total Value
                        </th>
                      </tr>
                      </thead>

                      <tbody>
                      {reportData.products?.map(
                          (product) => (
                              <tr
                                  key={product.id}
                                  className="border-t hover:bg-gray-50"
                              >
                                <td className="px-6 py-4">
                                  #{product.id}
                                </td>

                                <td className="px-6 py-4 font-medium">
                                  {product.name}
                                </td>

                                <td className="px-6 py-4">
                                  {product.stock}
                                </td>

                                <td className="px-6 py-4">
                                  ₹
                                  {Number(
                                      product.price
                                  ).toLocaleString()}
                                </td>

                                <td className="px-6 py-4">
                                  ₹
                                  {(
                                      Number(product.price) *
                                      Number(product.stock)
                                  ).toLocaleString()}
                                </td>
                              </tr>
                          )
                      )}
                      </tbody>
                    </table>
                  </div>
                </div>
            )}

        {/* ================================= */}
        {/* VENDOR REPORT */}
        {/* ================================= */}

        {!loading &&
            activeReport === "vendor" &&
            reportData && (
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        Vendor ID
                      </th>

                      <th className="px-6 py-4 text-left">
                        Vendor Name
                      </th>

                      <th className="px-6 py-4 text-left">
                        Total Products
                      </th>

                      <th className="px-6 py-4 text-left">
                        Total Purchase Orders
                      </th>
                    </tr>
                    </thead>

                    <tbody>
                    {reportData.map((vendor) => (
                        <tr
                            key={vendor.id}
                            className="border-t hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            #{vendor.id}
                          </td>

                          <td className="px-6 py-4 font-medium">
                            {vendor.name}
                          </td>

                          <td className="px-6 py-4">
                            {vendor.totalProducts}
                          </td>

                          <td className="px-6 py-4">
                            {vendor.totalPurchaseOrders}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            )}
      </div>
  );
}

export default Reports;