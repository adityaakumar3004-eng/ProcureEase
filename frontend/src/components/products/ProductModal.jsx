import { useEffect, useMemo } from "react";

function ProductModal({
                        showModal,
                        setShowModal,
                        formData,
                        handleChange,
                        handleSubmit,
                        vendors,
                        isEditing,
                      }) {
  const previewUrl = useMemo(() => {
    if (formData.productImage) {
      return URL.createObjectURL(formData.productImage);
    }

    return null;
  }, [formData.productImage]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!showModal) return null;

  const handleClose = () => {
    setShowModal(false);
  };

  return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

          {/* Modal Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200">

            <h2 className="text-2xl font-bold text-slate-800">
              {isEditing ? "Edit Product" : "Add Product"}
            </h2>

            <button
                onClick={handleClose}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
            >
              ×
            </button>

          </div>

          {/* Form */}
          <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
          >

            {/* Product Name */}
            <div>

              <label className="block mb-2 text-sm font-medium text-slate-700">
                Product Name
              </label>

              <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

            </div>

            {/* Description */}
            <div>

              <label className="block mb-2 text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                  name="description"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />

            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div>

                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Price
                </label>

                <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    name="price"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

              </div>

              <div>

                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Stock
                </label>

                <input
                    type="number"
                    min="0"
                    name="stock"
                    placeholder="Enter stock quantity"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

              </div>

            </div>

            {/* Vendor */}
            <div>

              <label className="block mb-2 text-sm font-medium text-slate-700">
                Vendor
              </label>

              <select
                  name="vendor_id"
                  value={formData.vendor_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">
                  Select Vendor
                </option>

                {vendors.map((vendor) => (
                    <option
                        key={vendor.id}
                        value={vendor.id}
                    >
                      {vendor.name}
                    </option>
                ))}

              </select>

            </div>

            {/* Product Image */}
            <div>

              <label className="block mb-2 text-sm font-medium text-slate-700">
                Product Image
              </label>

              <input
                  type="file"
                  name="productImage"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm cursor-pointer"
              />

              {previewUrl && (

                  <div className="mt-4">

                    <p className="text-sm font-medium text-slate-600 mb-2">
                      Image Preview
                    </p>

                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-xl border border-slate-200 shadow-sm"
                    />

                  </div>

              )}

            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-5 border-t border-slate-200">

              <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition"
              >
                {isEditing
                    ? "Update Product"
                    : "Add Product"}
              </button>

            </div>

          </form>

        </div>

      </div>
  );
}

export default ProductModal;