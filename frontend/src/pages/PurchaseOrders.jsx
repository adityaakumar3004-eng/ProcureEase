import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
} from "../services/purchaseOrderService";

import {
  exportPurchaseOrdersCSV,
  exportPurchaseOrdersExcel,
  exportPurchaseOrdersPDF,
} from "../services/exportService";

import { getVendors } from "../services/vendorService";
import { getProducts } from "../services/productService";

import PurchaseOrderTable from "../components/purchaseOrders/PurchaseOrderTable";
import PurchaseOrderModal from "../components/purchaseOrders/PurchaseOrderModal";

function PurchaseOrders() {
  const { isAdmin, isManager } = useAuth();

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const purchaseOrdersPerPage = 5;

  const [formData, setFormData] = useState({
    vendorId: "",
    items: [
      {
        productId: "",
        quantity: "",
      },
    ],
  });

  useEffect(() => {
    fetchPurchaseOrders();
    fetchVendors();
    fetchProducts();
  }, []);

  // ==========================================
  // Fetch Purchase Orders
  // ==========================================

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);

      const response = await getPurchaseOrders();

      console.log("Purchase Orders:", response);

      setPurchaseOrders(response.data || []);
    } catch (error) {
      console.error(
          "Error fetching purchase orders:",
          error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Fetch Vendors
  // ==========================================

  const fetchVendors = async () => {
    try {
      const response = await getVendors();

      setVendors(response.data || []);
    } catch (error) {
      console.error(
          "Error fetching vendors:",
          error
      );
    }
  };

  // ==========================================
  // Fetch Products
  // ==========================================

  const fetchProducts = async () => {
    try {
      const response = await getProducts({
        page: 1,
        limit: 100,
      });

      setProducts(response.data || []);
    } catch (error) {
      console.error(
          "Error fetching products:",
          error
      );
    }
  };

  // ==========================================
  // Export Handlers
  // ==========================================

  const handleExportCSV = async () => {
    try {
      await exportPurchaseOrdersCSV();
    } catch (error) {
      console.error(error);

      alert("Failed to export Purchase Orders as CSV.");
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportPurchaseOrdersExcel();
    } catch (error) {
      console.error(error);

      alert("Failed to export Purchase Orders as Excel.");
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportPurchaseOrdersPDF();
    } catch (error) {
      console.error(error);

      alert("Failed to export Purchase Orders as PDF.");
    }
  };

  // ==========================================
  // Vendor Change
  // ==========================================

  const handleVendorChange = (e) => {
    setFormData({
      vendorId: e.target.value,
      items: [
        {
          productId: "",
          quantity: "",
        },
      ],
    });
  };

  // ==========================================
  // Purchase Order Item Change
  // ==========================================

  const handleItemChange = (
      index,
      field,
      value
  ) => {
    const updatedItems = [...formData.items];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // ==========================================
  // Add Item
  // ==========================================

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: "",
          quantity: "",
        },
      ],
    }));
  };

  // ==========================================
  // Remove Item
  // ==========================================

  const removeItem = (index) => {
    if (formData.items.length === 1) return;

    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter(
          (_, i) => i !== index
      ),
    }));
  };

  // ==========================================
  // Create Purchase Order
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const purchaseOrderData = {
        vendorId: Number(formData.vendorId),

        items: formData.items.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
      };

      await createPurchaseOrder(
          purchaseOrderData
      );

      await fetchPurchaseOrders();

      setFormData({
        vendorId: "",
        items: [
          {
            productId: "",
            quantity: "",
          },
        ],
      });

      setShowModal(false);
    } catch (error) {
      console.error(error);

      alert(
          error.response?.data?.message ||
          "Failed to create Purchase Order."
      );
    }
  };

  // ==========================================
  // Update Purchase Order Status
  // ==========================================

  const handleStatusUpdate = async (
      id,
      status
  ) => {
    try {
      await updatePurchaseOrderStatus(
          id,
          status
      );

      await fetchPurchaseOrders();
    } catch (error) {
      console.error(error);

      alert(
          error.response?.data?.message ||
          "Failed to update purchase order status."
      );
    }
  };

  // ==========================================
  // Search
  // ==========================================

  const filteredPurchaseOrders = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return purchaseOrders.filter((order) => {
      return (
          order.vendorName
              ?.toLowerCase()
              .includes(search) ||
          order.status
              ?.toLowerCase()
              .includes(search) ||
          String(order.id).includes(search)
      );
    });
  }, [purchaseOrders, searchTerm]);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ==========================================
  // Pagination
  // ==========================================

  const indexOfLastOrder =
      currentPage * purchaseOrdersPerPage;

  const indexOfFirstOrder =
      indexOfLastOrder -
      purchaseOrdersPerPage;

  const currentOrders =
      filteredPurchaseOrders.slice(
          indexOfFirstOrder,
          indexOfLastOrder
      );

  const totalPages = Math.ceil(
      filteredPurchaseOrders.length /
      purchaseOrdersPerPage
  );

  if (loading) {
    return <h2>Loading Purchase Orders...</h2>;
  }

  return (
      <div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">
            Purchase Orders
          </h1>

          <div className="flex items-center gap-3">

            {/* Export CSV */}
            <button
                onClick={handleExportCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Export CSV
            </button>

            {/* Export Excel */}
            <button
                onClick={handleExportExcel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
            >
              Export Excel
            </button>

            {/* Export PDF */}
            <button
                onClick={handleExportPDF}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Export PDF
            </button>

            {/* Create Purchase Order */}
            {(isAdmin || isManager) && (
                <button
                    onClick={() => {
                      setFormData({
                        vendorId: "",
                        items: [
                          {
                            productId: "",
                            quantity: "",
                          },
                        ],
                      });

                      setShowModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                  + Create Purchase Order
                </button>
            )}

          </div>

        </div>

        {/* Search */}
        <div className="mb-6">
          <input
              type="text"
              placeholder="Search by ID, vendor, or status..."
              value={searchTerm}
              onChange={(e) =>
                  setSearchTerm(e.target.value)
              }
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Purchase Order Table */}
        <PurchaseOrderTable
            purchaseOrders={currentOrders}
            handleStatusUpdate={handleStatusUpdate}
        />

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">

              <button
                  onClick={() =>
                      setCurrentPage((prev) => prev - 1)
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
                      setCurrentPage((prev) => prev + 1)
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

        {/* Purchase Order Modal */}
        <PurchaseOrderModal
            showModal={showModal}
            setShowModal={setShowModal}
            formData={formData}
            setFormData={setFormData}
            handleVendorChange={handleVendorChange}
            handleItemChange={handleItemChange}
            addItem={addItem}
            removeItem={removeItem}
            handleSubmit={handleSubmit}
            vendors={vendors}
            products={products}
        />

      </div>
  );
}

export default PurchaseOrders;