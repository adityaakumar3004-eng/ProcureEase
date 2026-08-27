function InvoiceModal({
                        showModal,
                        setShowModal,
                        formData,
                        setFormData,
                        handleChange,
                        handleSubmit,
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
      purchase_order_id: "",
      invoice_number: "",
      invoice_date: "",
      status: "Pending",
      invoice: null,
    });
  };

  return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
          {/* Header */}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {isEditing
                  ? "Edit Invoice"
                  : "Add Invoice"}
            </h2>

            <button
                onClick={handleClose}
                className="text-2xl font-bold text-gray-600 hover:text-black"
            >
              ×
            </button>
          </div>

          {/* Form */}

          <form
              onSubmit={handleSubmit}
              className="space-y-4"
          >
            {/* Purchase Order ID */}

            <div>
              <label className="block mb-1 font-medium">
                Purchase Order ID
              </label>

              <input
                  type="number"
                  name="purchase_order_id"
                  value={formData.purchase_order_id}
                  onChange={handleChange}
                  placeholder="Enter purchase order ID"
                  min="1"
                  required
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Invoice Number */}

            <div>
              <label className="block mb-1 font-medium">
                Invoice Number
              </label>

              <input
                  type="text"
                  name="invoice_number"
                  value={formData.invoice_number}
                  onChange={handleChange}
                  placeholder="Enter invoice number"
                  required
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Invoice Date */}

            <div>
              <label className="block mb-1 font-medium">
                Invoice Date
              </label>

              <input
                  type="date"
                  name="invoice_date"
                  value={formData.invoice_date}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}

            <div>
              <label className="block mb-1 font-medium">
                Status
              </label>

              <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="Rejected">
                  Rejected
                </option>
              </select>
            </div>

            {/* Invoice PDF */}

            <div>
              <label className="block mb-1 font-medium">
                Invoice PDF
              </label>

              <input
                  type="file"
                  name="invoice"
                  accept=".pdf"
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
              />

              {isEditing && (
                  <p className="text-sm text-gray-500 mt-1">
                    Leave this empty if you do not want to
                    change the invoice PDF.
                  </p>
              )}
            </div>

            {/* Buttons */}

            <div className="flex justify-end gap-3 pt-4">
              <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>

              <button
                  type="submit"
                  className={`px-5 py-2 text-white rounded-lg transition ${
                      isEditing
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {isEditing
                    ? "Update Invoice"
                    : "Create Invoice"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}

export default InvoiceModal;