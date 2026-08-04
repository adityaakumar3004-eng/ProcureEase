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

      {/* Search */}
      <div className="mb-6">

        <input
          type="text"
          placeholder="Search products or vendors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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