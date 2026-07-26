function VendorModal({
  showModal,
  setShowModal,
  formData,
  handleChange,
  handleSubmit,
  setFormData,
  isEditing,
  setIsEditing,
  setEditingId,
}) {
  if (!showModal) return null;

  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingId(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {isEditing ? "Edit Vendor" : "Add Vendor"}
          </h2>

          <button
            onClick={handleClose}
            className="text-2xl font-bold text-gray-600 hover:text-black"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block mb-1 font-medium">
              Vendor Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              placeholder="Enter vendor name"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              rows="3"
              placeholder="Enter address"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`px-5 py-2 text-white rounded-lg ${
                isEditing
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isEditing ? "Update Vendor" : "Create Vendor"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default VendorModal;