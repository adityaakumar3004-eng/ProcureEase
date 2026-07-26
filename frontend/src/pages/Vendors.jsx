import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import VendorTable from "../components/vendors/VendorTable";
import VendorModal from "../components/vendors/VendorModal";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 5;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await api.get("/vendors");
      setVendors(response.data.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (vendor) => {
    setIsEditing(true);
    setEditingId(vendor.id);

    setFormData({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vendor?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/vendors/${id}`);
      fetchVendors();
    } catch (error) {
      console.error("Error deleting vendor:", error);
      alert("Failed to delete vendor");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await api.put(`/vendors/${editingId}`, formData);
      } else {
        await api.post("/vendors", formData);
      }

      fetchVendors();

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      setShowModal(false);
      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error(error);
      alert("Operation Failed");
    }
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const search = searchTerm.toLowerCase();

      return (
        vendor.name.toLowerCase().includes(search) ||
        vendor.email.toLowerCase().includes(search) ||
        vendor.phone.toLowerCase().includes(search) ||
        vendor.address.toLowerCase().includes(search)
      );
    });
  }, [vendors, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;

  const currentVendors = filteredVendors.slice(
    indexOfFirstVendor,
    indexOfLastVendor
  );

  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);

  if (loading) {
    return <h2>Loading Vendors...</h2>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vendors</h1>

        <button
          onClick={() => {
            setIsEditing(false);
            setEditingId(null);

            setFormData({
              name: "",
              email: "",
              phone: "",
              address: "",
            });

            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Vendor
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search vendors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Vendor Table */}
      <VendorTable
        vendors={currentVendors}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 px-4 py-2 rounded"
          >
            Previous
          </button>

          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      )}

      {/* Vendor Modal */}
      <VendorModal
        showModal={showModal}
        setShowModal={setShowModal}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setEditingId={setEditingId}
      />
    </div>
  );
}

export default Vendors;