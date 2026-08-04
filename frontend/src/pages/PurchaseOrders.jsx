import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
} from "../services/purchaseOrderService";

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
    vendor_id: "",
    items: [
      {
        product_id: "",
        quantity: "",
      },
    ],
  });

  useEffect(() => {
    fetchPurchaseOrders();
    fetchVendors();
    fetchProducts();
  }, []);

  const fetchPurchaseOrders = async () => {
  try {
    setLoading(true);

  const response = await getPurchaseOrders();

console.log("Purchase Orders:", response);

setPurchaseOrders(response);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const fetchVendors = async () => {
    try {
      const response = await getVendors();

      setVendors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts();

      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVendorChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      vendor_id: e.target.value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];

    updatedItems[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product_id: "",
          quantity: "",
        },
      ],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) return;

    const updatedItems = formData.items.filter(
      (_, i) => i !== index
    );

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };
    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createPurchaseOrder(formData);

      fetchPurchaseOrders();

      setFormData({
        vendor_id: "",
        items: [
          {
            product_id: "",
            quantity: "",
          },
        ],
      });

      setShowModal(false);

    } catch (error) {
      console.error(error);
      alert("Failed to create Purchase Order.");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updatePurchaseOrderStatus(id, status);

      fetchPurchaseOrders();

    } catch (error) {
      console.error(error);
      alert("Failed to update purchase order status.");
    }
  };

  const filteredPurchaseOrders = useMemo(() => {
    return purchaseOrders.filter((order) => {
      const search = searchTerm.toLowerCase();

      return (
        order.vendor_name.toLowerCase().includes(search) ||
        order.status.toLowerCase().includes(search)
      );
    });
  }, [purchaseOrders, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const indexOfLastOrder =
    currentPage * purchaseOrdersPerPage;

  const indexOfFirstOrder =
    indexOfLastOrder - purchaseOrdersPerPage;

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

        {(isAdmin || isManager) && (
          <button
            onClick={() => {
              setFormData({
                vendor_id: "",
                items: [
                  {
                    product_id: "",
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

      {/* Search */}
      <div className="mb-6">

        <input
          type="text"
          placeholder="Search purchase orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* Table */}
      <PurchaseOrderTable
        purchaseOrders={currentOrders}
        handleStatusUpdate={handleStatusUpdate}
      />

      {/* Pagination */}
      {totalPages > 1 && (

        <div className="flex justify-between items-center mt-6">

          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 px-4 py-2 rounded"
          >
            Previous
          </button>

          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 px-4 py-2 rounded"
          >
            Next
          </button>

        </div>

      )}

      {/* Modal */}
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