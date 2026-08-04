function PurchaseOrderModal({
  showModal,
  setShowModal,
  formData,
  setFormData,
  handleVendorChange,
  handleItemChange,
  addItem,
  removeItem,
  handleSubmit,
  vendors,
  products,
}) {
  if (!showModal) return null;

  const handleClose = () => {
    setShowModal(false);

    setFormData({
      vendor_id: "",
      items: [
        {
          product_id: "",
          quantity: "",
        },
      ],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Create Purchase Order
          </h2>

          <button
            onClick={handleClose}
            className="text-2xl font-bold text-gray-600 hover:text-black"
          >
            ×
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Vendor */}

          <div className="mb-6">

            <label className="block mb-2 font-medium">
              Vendor
            </label>

            <select
              value={formData.vendor_id}
              onChange={handleVendorChange}
              className="w-full border rounded-lg p-3"
              required
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

          {/* Products */}

          {formData.items.map((item, index) => (

            <div
              key={index}
              className="border rounded-lg p-4 mb-4"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Product */}

                <div>

                  <label className="block mb-2 font-medium">
                    Product
                  </label>

                  <select
                    value={item.product_id}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "product_id",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg p-3"
                    required
                  >

                    <option value="">
                      Select Product
                    </option>

                    {products.map((product) => (

                      <option
                        key={product.id}
                        value={product.id}
                      >
                        {product.name}
                      </option>

                    ))}

                  </select>

                </div>

                {/* Quantity */}

                <div>

                  <label className="block mb-2 font-medium">
                    Quantity
                  </label>

                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg p-3"
                    required
                  />

                </div>

              </div>
                            <div className="flex justify-end mt-4">

                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Remove Item
                  </button>
                )}

              </div>

            </div>

          ))}

          {/* Add Item */}

          <div className="mb-6">

            <button
              type="button"
              onClick={addItem}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
            >
              + Add Product
            </button>

          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Create Purchase Order
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default PurchaseOrderModal;