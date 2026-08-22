import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markInvoiceAsPaid,
} from "../services/invoiceService";

import {
  exportInvoicesCSV,
  exportInvoicesExcel,
  exportInvoicesPDF,
} from "../services/exportService";

import InvoiceModal from "../components/invoices/InvoiceModal";
import InvoiceTable from "../components/invoices/InvoiceTable";

function Invoices() {
  const { isAdmin, isManager } = useAuth();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5;

  const [formData, setFormData] = useState({
    purchase_order_id: "",
    invoice_number: "",
    invoice_date: "",
    status: "Pending",
    invoice: null,
  });

  // ============================================================
  // Fetch Invoices
  // ============================================================

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const response = await getInvoices();

      console.log("Invoices:", response);

      setInvoices(response.data || []);

    } catch (error) {
      console.error(
          "Error fetching invoices:",
          error
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Handle Input Change
  // ============================================================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ============================================================
  // Edit Invoice
  // ============================================================

  const handleEdit = (invoice) => {
    setIsEditing(true);

    setEditingId(invoice.id);

    setFormData({
      purchase_order_id:
          invoice.purchaseOrderId || "",

      invoice_number:
          invoice.invoiceNumber || "",

      invoice_date:
          invoice.invoiceDate?.split("T")[0] || "",

      status:
          invoice.status || "Pending",

      invoice: null,
    });

    setShowModal(true);
  };

  // ============================================================
  // Delete Invoice
  // ============================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this invoice?"
    );

    if (!confirmDelete) return;

    try {
      await deleteInvoice(id);

      await fetchInvoices();

    } catch (error) {
      console.error(error);

      alert(
          error.response?.data?.message ||
          "Failed to delete invoice."
      );
    }
  };

  // ============================================================
  // Mark Invoice As Paid
  // ============================================================

  const handleMarkPaid = async (id) => {
    try {
      await markInvoiceAsPaid(id, {
        paymentMethod: "Cash",
        transactionId: `TXN-${Date.now()}`,
      });

      await fetchInvoices();

    } catch (error) {
      console.error(error);

      alert(
          error.response?.data?.message ||
          "Failed to mark invoice as paid."
      );
    }
  };

  // ============================================================
  // Create / Update Invoice
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append(
        "purchaseOrderId",
        formData.purchase_order_id
    );

    data.append(
        "invoiceNumber",
        formData.invoice_number
    );

    data.append(
        "invoiceDate",
        formData.invoice_date
    );

    data.append(
        "status",
        formData.status
    );

    if (formData.invoice) {
      data.append(
          "invoice",
          formData.invoice
      );
    }

    try {
      if (isEditing) {
        await updateInvoice(
            editingId,
            data
        );
      } else {
        await createInvoice(data);
      }

      await fetchInvoices();

      setFormData({
        purchase_order_id: "",
        invoice_number: "",
        invoice_date: "",
        status: "Pending",
        invoice: null,
      });

      setShowModal(false);
      setIsEditing(false);
      setEditingId(null);

    } catch (error) {
      console.error(error);

      alert(
          error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.msg ||
          "Operation failed."
      );
    }
  };

  // ============================================================
  // Search
  // ============================================================

  const filteredInvoices = useMemo(() => {
    const search =
        searchTerm.toLowerCase();

    return invoices.filter((invoice) => {
      return (
          invoice.invoiceNumber
              ?.toLowerCase()
              .includes(search) ||

          invoice.status
              ?.toLowerCase()
              .includes(search) ||

          invoice.paymentStatus
              ?.toLowerCase()
              .includes(search)
      );
    });

  }, [
    invoices,
    searchTerm,
  ]);

  // ============================================================
  // Reset Page When Searching
  // ============================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ============================================================
  // Pagination
  // ============================================================

  const indexOfLastInvoice =
      currentPage * invoicesPerPage;

  const indexOfFirstInvoice =
      indexOfLastInvoice -
      invoicesPerPage;

  const currentInvoices =
      filteredInvoices.slice(
          indexOfFirstInvoice,
          indexOfLastInvoice
      );

  const totalPages = Math.ceil(
      filteredInvoices.length /
      invoicesPerPage
  );

  if (loading) {
    return (
        <h2>
          Loading Invoices...
        </h2>
    );
  }

  return (
      <div>

        {/* Header */}

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">
            Invoices
          </h1>

          <div className="flex items-center gap-3">

            {/* Export CSV */}

            <button
                onClick={exportInvoicesCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Export CSV
            </button>

            {/* Export Excel */}

            <button
                onClick={exportInvoicesExcel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
            >
              Export Excel
            </button>

            {/* Export PDF */}

            <button
                onClick={exportInvoicesPDF}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Export PDF
            </button>

            {/* Add Invoice */}

            {(isAdmin || isManager) && (
                <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditingId(null);

                      setFormData({
                        purchase_order_id: "",
                        invoice_number: "",
                        invoice_date: "",
                        status: "Pending",
                        invoice: null,
                      });

                      setShowModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                  + Add Invoice
                </button>
            )}

          </div>

        </div>

        {/* Search */}

        <div className="mb-6">

          <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) =>
                  setSearchTerm(e.target.value)
              }
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Invoice Table */}

        <InvoiceTable
            invoices={currentInvoices}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleMarkPaid={handleMarkPaid}
            isAdmin={isAdmin}
            isManager={isManager}
        />

        {/* Pagination */}

        {totalPages > 1 && (

            <div className="flex justify-between items-center mt-6">

              <button
                  onClick={() =>
                      setCurrentPage((prev) =>
                          Math.max(
                              prev - 1,
                              1
                          )
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
                          Math.min(
                              prev + 1,
                              totalPages
                          )
                      )
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

        {/* Invoice Modal */}

        <InvoiceModal
            showModal={showModal}
            setShowModal={setShowModal}
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setEditingId={setEditingId}
        />

      </div>
  );
}

export default Invoices;