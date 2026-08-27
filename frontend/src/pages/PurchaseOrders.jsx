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
    return (
        <div className="flex items-center justify-center py-20">
          <p className="text-lg text-slate-500">
            Loading Purchase Orders...
          </p>
        </div>
    );
  }

  return (
      <div>

        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 xl:flex-row xl:items-center xl:justify-end">

          <div className="flex flex-wrap items-center gap-3">

            <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-lg border border-green-200 bg-green-50 text-green-700 font-medium hover:bg-green-100 transition"
            >
              Export CSV
            </button>

            <button
                onClick={handleExportExcel}
                className="px-4 py-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 transition"
            >
              Export Excel
            </button>

            <button
                onClick={handleExportPDF}
                className="px-4 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 font-medium hover:bg-red-100 transition"
            >
              Export PDF
            </button>

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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition"
                >
                  + Create Purchase Order
                </button>
            )}

          </div>

        </div>

        {/* Search and Table Container */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

          {/* Search */}
          <div className="p-5 border-b border-slate-200">

            <input
                type="text"
                placeholder="Search by ID, vendor, or status..."
                value={searchTerm}
                onChange={(e) =>
                    setSearchTerm(e.target.value)
                }
                className="w-full max-w-xl border border-slate-300 rounded-lg px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* Purchase Order Table */}
          <PurchaseOrderTable
              purchaseOrders={currentOrders}
              handleStatusUpdate={handleStatusUpdate}
          />

        </div>

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">

              <button
                  onClick={() =>
                      setCurrentPage((prev) => prev - 1)
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              <span className="text-sm font-semibold text-slate-600">
            Page {currentPage} of {totalPages}
          </span>

              <button
                  onClick={() =>
                      setCurrentPage((prev) => prev + 1)
                  }
                  disabled={
                      currentPage === totalPages
                  }
                  className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
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