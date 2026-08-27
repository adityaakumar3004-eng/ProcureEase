import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
    getSales,
    createSale,
} from "../services/saleService";

import { getProducts } from "../services/productService";

import {
    exportSalesCSV,
    exportSalesExcel,
    exportSalesPDF,
} from "../services/exportService";

import SalesTable from "../components/sales/SalesTable";
import SaleModal from "../components/sales/SaleModal";

function Sales() {
    const { isAdmin, isManager } = useAuth();

    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const salesPerPage = 5;

    const [formData, setFormData] = useState({
        productId: "",
        quantity: "",
    });

    useEffect(() => {
        fetchSales();
        fetchProducts();
    }, []);

    // ============================================================
    // Fetch Sales
    // ============================================================

    const fetchSales = async () => {
        try {
            setLoading(true);

            const response = await getSales();

            setSales(response.data || []);
        } catch (error) {
            console.error("Error fetching sales:", error);
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // Fetch Products
    // ============================================================

    const fetchProducts = async () => {
        try {
            const response = await getProducts({
                page: 1,
                limit: 100,
            });

            setProducts(response.data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // ============================================================
    // Handle Form Change
    // ============================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ============================================================
    // Create Sale
    // ============================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedProduct = products.find(
            (product) =>
                product.id === Number(formData.productId)
        );

        if (!selectedProduct) {
            alert("Please select a product.");
            return;
        }

        if (
            Number(formData.quantity) >
            Number(selectedProduct.stock)
        ) {
            alert(
                `Only ${selectedProduct.stock} items are available in stock.`
            );

            return;
        }

        try {
            await createSale({
                productId: Number(formData.productId),
                quantity: Number(formData.quantity),
            });

            await fetchSales();
            await fetchProducts();

            setFormData({
                productId: "",
                quantity: "",
            });

            setShowModal(false);
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to record sale."
            );
        }
    };

    // ============================================================
    // Export Sales
    // ============================================================

    const handleExportCSV = async () => {
        try {
            await exportSalesCSV();
        } catch (error) {
            console.error(error);
            alert("Failed to export sales as CSV.");
        }
    };

    const handleExportExcel = async () => {
        try {
            await exportSalesExcel();
        } catch (error) {
            console.error(error);
            alert("Failed to export sales as Excel.");
        }
    };

    const handleExportPDF = async () => {
        try {
            await exportSalesPDF();
        } catch (error) {
            console.error(error);
            alert("Failed to export sales as PDF.");
        }
    };

    // ============================================================
    // Search
    // ============================================================

    const filteredSales = useMemo(() => {
        const search = searchTerm.toLowerCase().trim();

        return sales.filter((sale) => {
            return (
                sale.productName
                    ?.toLowerCase()
                    .includes(search) ||
                String(sale.id).includes(search)
            );
        });
    }, [sales, searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // ============================================================
    // Pagination
    // ============================================================

    const indexOfLastSale =
        currentPage * salesPerPage;

    const indexOfFirstSale =
        indexOfLastSale - salesPerPage;

    const currentSales =
        filteredSales.slice(
            indexOfFirstSale,
            indexOfLastSale
        );

    const totalPages = Math.ceil(
        filteredSales.length / salesPerPage
    );

    if (loading) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-semibold">
                    Loading Sales...
                </h2>
            </div>
        );
    }

    return (
        <div>

            {/* Header */}
            <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between">

                <div></div>

                <div className="flex flex-wrap gap-3">

                    {/* Export CSV */}
                    <button
                        onClick={handleExportCSV}
                        className="px-5 py-2.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium transition"
                    >
                        Export CSV
                    </button>

                    {/* Export Excel */}
                    <button
                        onClick={handleExportExcel}
                        className="px-5 py-2.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-medium transition"
                    >
                        Export Excel
                    </button>

                    {/* Export PDF */}
                    <button
                        onClick={handleExportPDF}
                        className="px-5 py-2.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium transition"
                    >
                        Export PDF
                    </button>

                    {/* Record Sale */}
                    {(isAdmin || isManager) && (
                        <button
                            onClick={() => {
                                setFormData({
                                    productId: "",
                                    quantity: "",
                                });

                                setShowModal(true);
                            }}
                            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition shadow-sm"
                        >
                            + Record Sale
                        </button>
                    )}

                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">

                <input
                    type="text"
                    placeholder="Search sales by product or ID..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

            </div>

            {/* Sales Table */}
            <SalesTable sales={currentSales} />

            {/* Pagination */}
            {totalPages > 1 && (

                <div className="flex justify-between items-center mt-6">

                    <button
                        onClick={() =>
                            setCurrentPage((prev) => prev - 1)
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    <span className="text-sm font-medium text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() =>
                            setCurrentPage((prev) => prev + 1)
                        }
                        disabled={
                            currentPage === totalPages
                        }
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>

                </div>

            )}

            {/* Sale Modal */}
            <SaleModal
                showModal={showModal}
                setShowModal={setShowModal}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                products={products}
            />

        </div>
    );
}

export default Sales;