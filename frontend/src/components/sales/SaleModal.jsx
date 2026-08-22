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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">
                        Record Sale
                    </h2>

                    <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>

                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    {/* Product */}
                    <div className="mb-4">

                        <label className="block mb-2 font-medium">
                            Product
                        </label>

                        <select
                            name="productId"
                            value={formData.productId}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">
                                Select Product
                            </option>

                            {products.map((product) => (
                                <option
                                    key={product.id}
                                    value={product.id}
                                    disabled={product.stock <= 0}
                                >
                                    {product.name} — Stock: {product.stock}
                                </option>
                            ))}

                        </select>

                    </div>

                    {/* Quantity */}
                    <div className="mb-6">

                        <label className="block mb-2 font-medium">
                            Quantity
                        </label>

                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="1"
                            required
                            placeholder="Enter quantity"
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
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