import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
    getSales,
    createSale,
} from "../services/saleService";

import { getProducts } from "../services/productService";

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

    const fetchSales = async () => {
        try {
            setLoading(true);

            const response = await getSales();

            console.log("Sales:", response);

            setSales(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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

    const filteredSales = useMemo(() => {
        const search = searchTerm.toLowerCase();

        return sales.filter((sale) =>
            sale.productName
                ?.toLowerCase()
                .includes(search)
        );
    }, [sales, searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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
        return <h2>Loading Sales...</h2>;
    }

    return (
        <div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Sales
                </h1>

                {(isAdmin || isManager) && (
                    <button
                        onClick={() => {
                            setFormData({
                                productId: "",
                                quantity: "",
                            });

                            setShowModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                    >
                        + Record Sale
                    </button>
                )}

            </div>

            {/* Search */}
            <div className="mb-6">

                <input
                    type="text"
                    placeholder="Search sales by product..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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