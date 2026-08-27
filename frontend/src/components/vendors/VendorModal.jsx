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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

        <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {isEditing ? "Edit Vendor" : "Add Vendor"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {isEditing
                    ? "Update the vendor information below."
                    : "Enter the vendor details below."}
              </p>
            </div>

            <button
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              ×
            </button>

          </div>

          {/* Form */}
          <form
              onSubmit={handleSubmit}
              className="space-y-5 px-6 py-6"
          >

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Vendor Name
              </label>

              <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter vendor name"
                  required
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter email address"
                  required
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Phone
              </label>

              <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter phone number"
                  required
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Address
              </label>

              <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  rows="3"
                  placeholder="Enter vendor address"
                  required
              />

            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

              <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
              >
                {isEditing
                    ? "Update Vendor"
                    : "Create Vendor"}
              </button>

            </div>

          </form>

        </div>

      </div>
  );
}

export default VendorModal;