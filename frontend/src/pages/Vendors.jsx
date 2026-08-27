import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../services/vendorService";

import VendorTable from "../components/vendors/VendorTable";
import VendorModal from "../components/vendors/VendorModal";

function Vendors() {
  const { isAdmin, isManager } = useAuth();

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
      setLoading(true);

      const response = await getVendors();

      setVendors(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
    if (!window.confirm("Are you sure you want to delete this vendor?")) {
      return;
    }

    try {
      await deleteVendor(id);
      fetchVendors();
    } catch (error) {
      console.error(error);
      alert("Failed to delete vendor.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await updateVendor(editingId, formData);
      } else {
        await createVendor(formData);
      }

      fetchVendors();

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      setShowModal(false);
      setEditingId(null);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Operation failed.");
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

  const totalPages = Math.ceil(
      filteredVendors.length / vendorsPerPage
  );

  if (loading) {
    return (
        <div className="flex items-center justify-center py-20">
          <p className="text-lg font-medium text-slate-500">
            Loading vendors...
          </p>
        </div>
    );
  }

  return (
      <div className="max-w-[1600px] mx-auto">

        {/* Action Bar */}
        {(isAdmin || isManager) && (
            <div className="flex justify-end mb-6">
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
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
              >
                + Add Vendor
              </button>
            </div>
        )}

        {/* Main Content Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* Search */}
          <div className="border-b border-slate-200 p-5">

            <div className="relative max-w-md">
              <input
                  type="text"
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-4 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <VendorTable
                vendors={currentVendors}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
              <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-medium text-slate-700">
                {indexOfFirstVendor + 1}
              </span>{" "}
                  to{" "}
                  <span className="font-medium text-slate-700">
                {Math.min(indexOfLastVendor, filteredVendors.length)}
              </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-700">
                {filteredVendors.length}
              </span>{" "}
                  vendors
                </p>

                <div className="flex items-center gap-3">

                  <button
                      onClick={() =>
                          setCurrentPage((prev) => prev - 1)
                      }
                      disabled={currentPage === 1}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <span className="text-sm font-medium text-slate-600">
                Page {currentPage} of {totalPages}
              </span>

                  <button
                      onClick={() =>
                          setCurrentPage((prev) => prev + 1)
                      }
                      disabled={currentPage === totalPages}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>

                </div>

              </div>
          )}

        </div>

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