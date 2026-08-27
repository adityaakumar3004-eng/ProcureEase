import { useEffect, useMemo, useState } from "react";

import { getProducts } from "../services/productService";

import InventoryTable from "../components/inventory/InventoryTable";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 5;

  // ============================================================
  // Fetch Products
  // ============================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts({
        page: 1,
        limit: 100,
      });

      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Inventory Summary
  // ============================================================

  const totalProducts = products.length;

  const totalStock = products.reduce(
      (total, product) =>
          total + Number(product.stock || 0),
      0
  );

  const totalInventoryValue = products.reduce(
      (total, product) =>
          total +
          Number(product.price || 0) *
          Number(product.stock || 0),
      0
  );

  const lowStockProducts = products.filter(
      (product) => {
        const stock = Number(product.stock || 0);

        return stock > 0 && stock <= 10;
      }
  ).length;

  // ============================================================
  // Search
  // ============================================================

  const filteredProducts = useMemo(() => {
    const search = searchTerm
        .toLowerCase()
        .trim();

    return products.filter((product) => {
      const vendorName =
          product.vendorName ||
          product.vendor_name ||
          "";

      return (
          product.name
              ?.toLowerCase()
              .includes(search) ||
          vendorName
              .toLowerCase()
              .includes(search) ||
          String(product.id).includes(search)
      );
    });
  }, [products, searchTerm]);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ============================================================
  // Pagination
  // ============================================================

  const indexOfLastProduct =
      currentPage * productsPerPage;

  const indexOfFirstProduct =
      indexOfLastProduct - productsPerPage;

  const currentProducts =
      filteredProducts.slice(
          indexOfFirstProduct,
          indexOfLastProduct
      );

  const totalPages = Math.ceil(
      filteredProducts.length / productsPerPage
  );

  if (loading) {
    return (
        <div className="p-6">
          <h2 className="text-xl font-semibold">
            Loading Inventory...
          </h2>
        </div>
    );
  }

  return (
      <div>

        {/* Inventory Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* Total Products */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Total Products
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {totalProducts}
            </h2>

          </div>

          {/* Total Stock */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Total Stock
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {totalStock.toLocaleString()}
            </h2>

          </div>

          {/* Inventory Value */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Inventory Value
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              ₹{totalInventoryValue.toLocaleString()}
            </h2>

          </div>

          {/* Low Stock Products */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Low Stock Products
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {lowStockProducts}
            </h2>

          </div>

        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">

          <input
              type="text"
              placeholder="Search products, vendors, or ID..."
              value={searchTerm}
              onChange={(e) =>
                  setSearchTerm(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

        </div>

        {/* Inventory Table */}
        <InventoryTable
            products={currentProducts}
        />

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
                          Math.min(prev + 1, totalPages)
                      )
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>

            </div>

        )}

      </div>
  );
}

export default Inventory;