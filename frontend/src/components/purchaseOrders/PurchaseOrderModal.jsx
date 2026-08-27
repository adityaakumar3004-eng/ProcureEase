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
      vendorId: "",
      items: [
        {
          productId: "",
          quantity: "",
        },
      ],
    });
  };

  return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">

        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200">

            <h2 className="text-2xl font-bold text-slate-800">
              Create Purchase Order
            </h2>

            <button
                onClick={handleClose}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-2xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
            >
              ×
            </button>

          </div>

          <form
              onSubmit={handleSubmit}
              className="p-6"
          >

            {/* Vendor */}
            <div className="mb-6">

              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Vendor
              </label>

              <select
                  value={formData.vendorId}
                  onChange={handleVendorChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
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
            <div className="mb-5">

              <h3 className="text-lg font-semibold text-slate-800">
                Order Items
              </h3>

            </div>

            {formData.items.map((item, index) => (

                <div
                    key={index}
                    className="border border-slate-200 rounded-xl p-5 mb-4 bg-slate-50/50"
                >

                  <div className="flex items-center justify-between mb-4">

                <span className="font-semibold text-slate-700">
                  Item {index + 1}
                </span>

                    {formData.items.length > 1 && (

                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-sm font-medium text-red-600 hover:text-red-700 transition"
                        >
                          Remove
                        </button>

                    )}

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Product */}
                    <div>

                      <label className="block mb-2 text-sm font-medium text-slate-700">
                        Product
                      </label>

                      <select
                          value={item.productId}
                          onChange={(e) =>
                              handleItemChange(
                                  index,
                                  "productId",
                                  e.target.value
                              )
                          }
                          className="w-full border border-slate-300 bg-white rounded-lg px-4 py-3 text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
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

                      <label className="block mb-2 text-sm font-medium text-slate-700">
                        Quantity
                      </label>

                      <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          placeholder="Enter quantity"
                          onChange={(e) =>
                              handleItemChange(
                                  index,
                                  "quantity",
                                  e.target.value
                              )
                          }
                          className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                          required
                      />

                    </div>

                  </div>

                </div>

            ))}

            {/* Add Item */}
            <button
                type="button"
                onClick={addItem}
                className="mb-8 px-4 py-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition"
            >
              + Add Product
            </button>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-5 border-t border-slate-200">

              <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition"
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