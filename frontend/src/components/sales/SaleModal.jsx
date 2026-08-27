function SaleModal({
                       showModal,
                       setShowModal,
                       formData,
                       handleChange,
                       handleSubmit,
                       products,
                   }) {

    if (!showModal) {
        return null;
    }

    const selectedProduct = products.find(
        (product) =>
            product.id === Number(formData.productId)
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold text-gray-800">
                        Record Sale
                    </h2>

                    <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
                    >
                        ×
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    {/* Product */}
                    <div className="mb-5">

                        <label className="block mb-2 font-medium text-gray-700">
                            Product
                        </label>

                        <select
                            name="productId"
                            value={formData.productId}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">
                                Select Product
                            </option>

                            {products.map((product) => (

                                <option
                                    key={product.id}
                                    value={product.id}
                                    disabled={Number(product.stock) <= 0}
                                >
                                    {product.name} — Stock: {product.stock}
                                </option>

                            ))}

                        </select>

                    </div>

                    {/* Product Information */}
                    {selectedProduct && (

                        <div className="mb-5 bg-gray-50 border border-gray-200 rounded-lg p-4">

                            <div className="flex justify-between mb-3">

                <span className="text-gray-600">
                  Available Stock
                </span>

                                <span className="font-medium text-gray-800">
                  {selectedProduct.stock}
                </span>

                            </div>

                            <div className="flex justify-between">

                <span className="text-gray-600">
                  Product Price
                </span>

                                <span className="font-medium text-gray-800">
                  ₹
                                    {Number(
                                        selectedProduct.price
                                    ).toLocaleString()}
                </span>

                            </div>

                        </div>

                    )}

                    {/* Quantity */}
                    <div className="mb-5">

                        <label className="block mb-2 font-medium text-gray-700">
                            Quantity
                        </label>

                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="1"
                            max={
                                selectedProduct
                                    ? selectedProduct.stock
                                    : undefined
                            }
                            required
                            placeholder="Enter quantity"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        {selectedProduct && (

                            <p className="text-sm text-gray-500 mt-2">

                                Maximum available quantity:{" "}

                                {selectedProduct.stock}

                            </p>

                        )}

                    </div>

                    {/* Estimated Total */}
                    {selectedProduct &&
                        formData.quantity &&
                        Number(formData.quantity) > 0 && (

                            <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4">

                                <div className="flex justify-between items-center">

                  <span className="font-medium text-blue-800">
                    Estimated Total
                  </span>

                                    <span className="text-lg font-semibold text-blue-800">

                    ₹
                                        {(
                                            Number(selectedProduct.price) *
                                            Number(formData.quantity)
                                        ).toLocaleString()}

                  </span>

                                </div>

                            </div>

                        )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                        >
                            Record Sale
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default SaleModal;