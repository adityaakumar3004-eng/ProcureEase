import { useMemo } from "react";

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

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">
          {isEditing ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border rounded-lg p-2"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              min="0.01"
              step="0.01"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
              className="border rounded-lg p-2"
            />

            <input
              type="number"
              min="0"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="border rounded-lg p-2"
            />
          </div>

          <select
            name="vendor_id"
            value={formData.vendor_id}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select Vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            name="productImage"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleChange}
            className="w-full"
          />

          {previewUrl && (
            <div>
              <p className="font-medium mb-2">Image Preview</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isEditing ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;