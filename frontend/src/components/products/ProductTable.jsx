import { useAuth } from "../../context/AuthContext";

function ProductTable({
  products,
  handleEdit,
  handleDelete,
}) {
  const { isAdmin, isManager } = useAuth();

  const IMAGE_BASE_URL =
    "https://procureease-backend.onrender.com/uploads/products";

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="min-w-full border-collapse">

        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Image</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-left">Vendor</th>
            <th className="px-4 py-3 text-left">Price</th>
            <th className="px-4 py-3 text-left">Stock</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className="text-center py-8"
              >
                No Products Found
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product.id}
                className="border-t hover:bg-gray-50"
              >
                {/* Image */}
                <td className="px-4 py-3">
                  {product.image ? (
                    <img
                      src={`${IMAGE_BASE_URL}/${product.image}`}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center border rounded-lg text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </td>

                {/* Name */}
                <td className="px-4 py-3">
                  {product.name}
                </td>

                {/* Description */}
                <td className="px-4 py-3">
                  {product.description}
                </td>

                {/* Vendor */}
                <td className="px-4 py-3">
                  {product.vendor_name}
                </td>

                {/* Price */}
                <td className="px-4 py-3">
                  ₹{Number(product.price).toLocaleString()}
                </td>

                {/* Stock */}
                <td className="px-4 py-3">
                  {product.stock}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">

                    {(isAdmin || isManager) && (
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    )}

                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}

export default ProductTable;