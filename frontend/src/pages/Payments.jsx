import { useEffect, useMemo, useState } from "react";

import { getPayments } from "../services/paymentService";

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

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const response = await getPayments();

      console.log("Payments:", response);

      setPayments(response.data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search
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

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination
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
      filteredPayments.length / paymentsPerPage
  );

  if (loading) {
    return <h2>Loading Payments...</h2>;
  }

  return (
      <div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Payments
          </h1>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) =>
                  setSearchTerm(e.target.value)
              }
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 px-4 py-2 rounded"
              >
                Previous
              </button>

              <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>

              <button
                  onClick={() =>
                      setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                      )
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

export default Payments;