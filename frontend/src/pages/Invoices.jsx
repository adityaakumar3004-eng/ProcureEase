import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markInvoiceAsPaid,
} from "../services/invoiceService";

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

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const response = await getInvoices();

      setInvoices(response.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
    const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleEdit = (invoice) => {
    setIsEditing(true);
    setEditingId(invoice.id);

    setFormData({
      purchase_order_id: invoice.purchase_order_id,
      invoice_number: invoice.invoice_number,
      invoice_date: invoice.invoice_date?.split("T")[0],
      status: invoice.status,
      invoice: null,
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmDelete) return;

    try {
      await deleteInvoice(id);

      fetchInvoices();

    } catch (error) {
      console.error(error);
      alert("Failed to delete invoice.");
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await markInvoiceAsPaid(id, {
        payment_method: "Cash",
        transaction_id: `TXN-${Date.now()}`,
      });

      fetchInvoices();

    } catch (error) {
      console.error(error);
      alert("Failed to mark invoice as paid.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      if (isEditing) {
        await updateInvoice(editingId, data);
      } else {
        await createInvoice(data);
      }

      fetchInvoices();

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

  console.log(error.response);

  alert(
    error.response?.data?.message ||
    error.response?.data?.errors?.[0]?.msg ||
    "Operation failed."
  );
}
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const search = searchTerm.toLowerCase();

      return (
        invoice.invoice_number
          .toLowerCase()
          .includes(search) ||
        invoice.status
          .toLowerCase()
          .includes(search)
      );
    });
  }, [invoices, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const indexOfLastInvoice =
    currentPage * invoicesPerPage;

  const indexOfFirstInvoice =
    indexOfLastInvoice - invoicesPerPage;

  const currentInvoices =
    filteredInvoices.slice(
      indexOfFirstInvoice,
      indexOfLastInvoice
    );

  const totalPages = Math.ceil(
    filteredInvoices.length / invoicesPerPage
  );

  if (loading) {
    return <h2>Loading Invoices...</h2>;
  }
  return (
  <div>

    {/* Header */}
    <div className="flex justify-between items-center mb-6">

      <h1 className="text-3xl font-bold">
        Invoices
      </h1>

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

    {/* Table */}
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

    {/* Modal */}
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