import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

import {
  exportProductsCSV,
  exportProductsExcel,
  exportProductsPDF,
} from "../services/exportService";

import { getVendors } from "../services/vendorService";

import ProductTable from "../components/products/ProductTable";
import ProductModal from "../components/products/ProductModal";

function Products() {
  const { isAdmin, isManager } = useAuth();

  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    vendor_id: "",
    productImage: null,
  });

  const [filters, setFilters] = useState({
    search: "",
    vendorId: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "name",
    order: "ASC",
    page: 1,
    limit: 5,
  });

  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // ============================================================
  // Fetch Products
  // ============================================================

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // ============================================================
  // Fetch Vendors
  // ============================================================

  useEffect(() => {
    fetchVendors();
  }, []);

  // ============================================================
  // Search Debounce
  // ============================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // ============================================================
  // Minimum Price Debounce
  // ============================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        minPrice: minPriceInput,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [minPriceInput]);

  // ============================================================
  // Maximum Price Debounce
  // ============================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        maxPrice: maxPriceInput,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [maxPriceInput]);

  // ============================================================
  // Fetch Products Function
  // ============================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts(filters);

      setProducts(response.data || []);

      setPagination({
        page: response.page || 1,
        totalPages: response.totalPages || 1,
        total: response.total || 0,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Fetch Vendors Function
  // ============================================================

  const fetchVendors = async () => {
    try {
      const response = await getVendors();

      setVendors(response.data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  // ============================================================
  // Handle Form Change
  // ============================================================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "productImage") {
      setFormData((prev) => ({
        ...prev,
        productImage: files && files[0]
            ? files[0]
            : null,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // Edit Product
  // ============================================================

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditingId(product.id);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock ?? "",
      vendor_id: String(product.vendorId || ""),
      productImage: null,
    });

    setShowModal(true);
  };

  // ============================================================
  // Delete Product
  // ============================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteProduct(id);

      await fetchProducts();
    } catch (error) {
      console.error(error);

      alert(
          error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  // ============================================================
  // Create / Update Product
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = new FormData();

      submitData.append(
          "name",
          formData.name
      );

      submitData.append(
          "description",
          formData.description
      );

      submitData.append(
          "price",
          formData.price
      );

      submitData.append(
          "stock",
          formData.stock
      );

      submitData.append(
          "vendorId",
          formData.vendor_id
      );

      // Add image only when a file is selected
      if (formData.productImage instanceof File) {
        submitData.append(
            "productImage",
            formData.productImage
        );
      }

      if (isEditing) {
        await updateProduct(
            editingId,
            submitData
        );
      } else {
        await createProduct(
            submitData
        );
      }

      // Wait until latest products are loaded
      await fetchProducts();

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        vendor_id: "",
        productImage: null,
      });

      setEditingId(null);
      setIsEditing(false);
      setShowModal(false);

    } catch (error) {
      console.error(
          "Product operation failed:",
          error
      );

      alert(
          error.response?.data?.message ||
          "Operation failed."
      );
    }
  };

  // ============================================================
  // Export Products
  // ============================================================

  const handleExportCSV = async () => {
    try {
      await exportProductsCSV();
    } catch (error) {
      console.error(error);
      alert("Failed to export products as CSV.");
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportProductsExcel();
    } catch (error) {
      console.error(error);
      alert("Failed to export products as Excel.");
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportProductsPDF();
    } catch (error) {
      console.error(error);
      alert("Failed to export products as PDF.");
    }
  };

  // ============================================================
  // Update Filter
  // ============================================================

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  // ============================================================
  // Pagination
  // ============================================================

  const nextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setFilters((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const previousPage = () => {
    if (pagination.page > 1) {
      setFilters((prev) => ({
        ...prev,
        page: prev.page - 1,
      }));
    }
  };

  // ============================================================
  // Open Add Product Modal
  // ============================================================

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      vendor_id: "",
      productImage: null,
    });

    setShowModal(true);
  };

  // ============================================================
  // Loading
  // ============================================================

  if (loading && products.length === 0) {
    return (
        <div className="flex items-center justify-center py-20">
          <h2 className="text-lg font-medium text-slate-500">
            Loading Products...
          </h2>
        </div>
    );
  }

  return (
      <div className="max-w-[1600px] mx-auto">

        {/* Header Actions */}
        <div className="flex flex-col gap-4 mb-7 lg:flex-row lg:items-center lg:justify-end">

          <div className="flex flex-wrap items-center gap-3">

            <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 text-sm font-medium text-green-700 bg-white border border-green-200 rounded-lg shadow-sm hover:bg-green-50 transition"
            >
              Export CSV
            </button>

            <button
                onClick={handleExportExcel}
                className="px-4 py-2.5 text-sm font-medium text-emerald-700 bg-white border border-emerald-200 rounded-lg shadow-sm hover:bg-emerald-50 transition"
            >
              Export Excel
            </button>

            <button
                onClick={handleExportPDF}
                className="px-4 py-2.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg shadow-sm hover:bg-red-50 transition"
            >
              Export PDF
            </button>

            {(isAdmin || isManager) && (
                <button
                    onClick={openAddModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition"
                >
                  + Add Product
                </button>
            )}

          </div>

        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

            <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) =>
                    updateFilter(
                        "search",
                        e.target.value
                    )
                }
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <select
                value={filters.vendorId}
                onChange={(e) =>
                    updateFilter(
                        "vendorId",
                        e.target.value
                    )
                }
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">
                All Vendors
              </option>

              {vendors.map((vendor) => (
                  <option
                      key={vendor.id}
                      value={vendor.id}
                  >
                    {vendor.name}
                  </option>
              ))}
            </select>

            <select
                value={filters.sortBy}
                onChange={(e) =>
                    updateFilter(
                        "sortBy",
                        e.target.value
                    )
                }
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="name">
                Sort by Name
              </option>

              <option value="price">
                Sort by Price
              </option>

              <option value="stock">
                Sort by Stock
              </option>
            </select>

            <input
                type="number"
                placeholder="Minimum Price"
                value={minPriceInput}
                onChange={(e) =>
                    setMinPriceInput(e.target.value)
                }
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <input
                type="number"
                placeholder="Maximum Price"
                value={maxPriceInput}
                onChange={(e) =>
                    setMaxPriceInput(e.target.value)
                }
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <select
                value={filters.order}
                onChange={(e) =>
                    updateFilter(
                        "order",
                        e.target.value
                    )
                }
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="ASC">
                Ascending
              </option>

              <option value="DESC">
                Descending
              </option>
            </select>

          </div>

        </div>

        {/* Product Table */}
        <ProductTable
            products={products}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">

              <button
                  onClick={previousPage}
                  disabled={pagination.page === 1}
                  className="px-5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-medium shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              <span className="text-sm font-medium text-slate-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>

              <button
                  onClick={nextPage}
                  disabled={
                      pagination.page === pagination.totalPages
                  }
                  className="px-5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-medium shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>

            </div>
        )}

        {/* Product Modal */}
        <ProductModal
            showModal={showModal}
            setShowModal={setShowModal}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            vendors={vendors}
            isEditing={isEditing}
        />

      </div>
  );
}

export default Products;