import { useEffect, useMemo, useState } from "react";

import { getProducts } from "../services/productService";

import InventoryTable from "../components/inventory/InventoryTable";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts();

      setProducts(response.data);
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
      (product) => Number(product.stock) <= 10
  ).length;

  // ============================================================
  // Search
  // ============================================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = searchTerm.toLowerCase();

      return (
          product.name.toLowerCase().includes(search) ||
          product.vendor_name.toLowerCase().includes(search)
      );
    });
  }, [products, searchTerm]);

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
    return <h2>Loading Inventory...</h2>;
  }

  return (
      <div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Inventory
          </h1>
        </div>

        {/* Inventory Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

          {/* Total Products */}
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500">
              Total Products
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {totalProducts}
            </h2>
          </div>

          {/* Total Stock */}
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500">
              Total Stock
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {totalStock}
            </h2>
          </div>

          {/* Inventory Value */}
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500">
              Inventory Value
            </p>

            <h2 className="text-3xl font-bold text-purple-600 mt-2">
              ₹{totalInventoryValue.toLocaleString()}
            </h2>
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500">
              Low Stock Products
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {lowStockProducts}
            </h2>
          </div>

        </div>

        {/* Search */}
        <div className="mb-6">

          <input
              type="text"
              placeholder="Search products or vendors..."
              value={searchTerm}
              onChange={(e) =>
                  setSearchTerm(e.target.value)
              }
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  disabled={currentPage === totalPages}
                  className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 px-4 py-2 rounded"
              >
                Next
              </button>

            </div>

        )}

      </div>
  );
}

export default Inventory;