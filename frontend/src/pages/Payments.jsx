import { useEffect, useMemo, useState } from "react";

import { getPayments } from "../services/paymentService";

import {
    exportPaymentsCSV,
    exportPaymentsExcel,
    exportPaymentsPDF,
} from "../services/exportService";

import PaymentTable from "../components/payments/PaymentTable";

function Payments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const paymentsPerPage = 5;

    useEffect(() => {
        fetchPayments();
    }, []);

    // ============================================================
    // Fetch Payments
    // ============================================================

    const fetchPayments = async () => {
        try {
            setLoading(true);

            const response = await getPayments();

            setPayments(response.data || []);

        } catch (error) {
            console.error(
                "Error fetching payments:",
                error
            );

        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // Export Payments
    // ============================================================

    const handleExportCSV = async () => {
        try {
            await exportPaymentsCSV();

        } catch (error) {
            console.error(error);

            alert(
                "Failed to export payments as CSV."
            );
        }
    };

    const handleExportExcel = async () => {
        try {
            await exportPaymentsExcel();

        } catch (error) {
            console.error(error);

            alert(
                "Failed to export payments as Excel."
            );
        }
    };

    const handleExportPDF = async () => {
        try {
            await exportPaymentsPDF();

        } catch (error) {
            console.error(error);

            alert(
                "Failed to export payments as PDF."
            );
        }
    };

    // ============================================================
    // Search
    // ============================================================

    const filteredPayments = useMemo(() => {
        const search = searchTerm.toLowerCase();

        return payments.filter((payment) => {

            return (
                payment.invoiceNumber
                    ?.toLowerCase()
                    .includes(search) ||

                payment.vendorName
                    ?.toLowerCase()
                    .includes(search) ||

                payment.paymentMethod
                    ?.toLowerCase()
                    .includes(search) ||

                payment.transactionId
                    ?.toLowerCase()
                    .includes(search)
            );
        });

    }, [payments, searchTerm]);

    // ============================================================
    // Reset Page When Searching
    // ============================================================

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // ============================================================
    // Pagination
    // ============================================================

    const indexOfLastPayment =
        currentPage * paymentsPerPage;

    const indexOfFirstPayment =
        indexOfLastPayment - paymentsPerPage;

    const currentPayments =
        filteredPayments.slice(
            indexOfFirstPayment,
            indexOfLastPayment
        );

    const totalPages = Math.ceil(
        filteredPayments.length /
        paymentsPerPage
    );

    if (loading) {
        return (
            <h2>
                Loading Payments...
            </h2>
        );
    }

    return (
        <div>

            {/* Export Buttons */}

            <div className="flex justify-end items-center mb-6">

                <div className="flex items-center gap-3">

                    <button
                        onClick={handleExportCSV}
                        className="px-4 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                    >
                        Export CSV
                    </button>

                    <button
                        onClick={handleExportExcel}
                        className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    >
                        Export Excel
                    </button>

                    <button
                        onClick={handleExportPDF}
                        className="px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                    >
                        Export PDF
                    </button>

                </div>

            </div>

            {/* Search */}

            <div className="mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">

                <input
                    type="text"
                    placeholder="Search by invoice, vendor, method, or transaction ID..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

            </div>

            {/* Payment Table */}

            <PaymentTable
                payments={currentPayments}
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
                        className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>

                    <span className="font-medium text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(
                                    prev + 1,
                                    totalPages
                                )
                            )
                        }
                        disabled={
                            currentPage === totalPages
                        }
                        className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>

                </div>

            )}

        </div>
    );
}

export default Payments;