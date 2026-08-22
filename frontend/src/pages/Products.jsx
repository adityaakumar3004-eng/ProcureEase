import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

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

  // Separate input states for price filters
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Fetch vendors once
  useEffect(() => {
    fetchVendors();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: prev.search,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Debounce minimum price
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

  // Debounce maximum price
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

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts(filters);

      console.log("Products:", response);

      setProducts(response.data);

      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        total: response.total,
      });
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "productImage") {
      setFormData((prev) => ({
        ...prev,
        productImage: files[0],
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditingId(product.id);

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      vendor_id: String(product.vendorId),
      productImage: null,
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
        !window.confirm(
            "Are you sure you want to delete this product?"
        )
    ) {
      return;
    }

    try {
      await deleteProduct(id);

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = new FormData();

      submitData.append("name", formData.name);
      submitData.append(
          "description",
          formData.description
      );
      submitData.append("price", formData.price);
      submitData.append("stock", formData.stock);
      submitData.append(
          "vendorId",
          formData.vendor_id
      );

      if (formData.productImage) {
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
        await createProduct(submitData);
      }

      fetchProducts();

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        vendor_id: "",
        productImage: null,
      });

      setShowModal(false);
      setEditingId(null);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Operation failed.");
    }
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

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

  if (loading && products.length === 0) {
    return <h2>Loading Products...</h2>;
  }

  return (
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          {(isAdmin || isManager) && (
              <button
                  onClick={() => {
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
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
              >
                + Add Product
              </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">

          {/* Search */}
          <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) =>
                  updateFilter(
                      "search",
                      e.target.value
                  )
              }
              className="border rounded-lg p-2"
          />

          {/* Vendor */}
          <select
              value={filters.vendorId}
              onChange={(e) =>
                  updateFilter(
                      "vendorId",
                      e.target.value
                  )
              }
              className="border rounded-lg p-2"
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

          {/* Minimum Price */}
          <input
              type="number"
              placeholder="Min Price"
              value={minPriceInput}
              onChange={(e) =>
                  setMinPriceInput(
                      e.target.value
                  )
              }
              className="border rounded-lg p-2"
          />

          {/* Maximum Price */}
          <input
              type="number"
              placeholder="Max Price"
              value={maxPriceInput}
              onChange={(e) =>
                  setMaxPriceInput(
                      e.target.value
                  )
              }
              className="border rounded-lg p-2"
          />

          {/* Sort By */}
          <select
              value={filters.sortBy}
              onChange={(e) =>
                  updateFilter(
                      "sortBy",
                      e.target.value
                  )
              }
              className="border rounded-lg p-2"
          >
            <option value="name">
              Name
            </option>

            <option value="price">
              Price
            </option>

            <option value="stock">
              Stock
            </option>
          </select>

          {/* Sort Order */}
          <select
              value={filters.order}
              onChange={(e) =>
                  updateFilter(
                      "order",
                      e.target.value
                  )
              }
              className="border rounded-lg p-2"
          >
            <option value="ASC">
              Ascending
            </option>

            <option value="DESC">
              Descending
            </option>
          </select>

        </div>

        {/* Product Table */}
        <ProductTable
            products={products}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">

          <button
              onClick={previousPage}
              disabled={pagination.page === 1}
              className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 px-4 py-2 rounded"
          >
            Previous
          </button>

          <span className="font-semibold">
          Page {pagination.page} of{" "}
            {pagination.totalPages}
        </span>

          <button
              onClick={nextPage}
              disabled={
                  pagination.page ===
                  pagination.totalPages
              }
              className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 px-4 py-2 rounded"
          >
            Next
          </button>

        </div>

        {/* Product Modal */}
        <ProductModal
            showModal={showModal}
            setShowModal={setShowModal}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setFormData={setFormData}
            vendors={vendors}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setEditingId={setEditingId}
        />

      </div>
  );
}

export default Products;