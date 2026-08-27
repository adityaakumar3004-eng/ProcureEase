import { useAuth } from "../../context/AuthContext";

function ProductTable({
                        products,
                        handleEdit,
                        handleDelete,
                      }) {
  const { isAdmin, isManager } = useAuth();

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    // If image is already a complete URL
    if (image.startsWith("http")) {
      return image;
    }

    // Remove extra slashes
    const cleanImageName = image.replace(/^\/+/, "");

    // Use the backend currently running locally
    return `http://localhost:5000/uploads/products/${cleanImageName}`;
  };

  return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-full border-collapse">

            <thead className="bg-slate-50 border-b border-slate-200">

            <tr>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Image
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Name
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Description
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Vendor
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Price
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Stock
              </th>

              {(isAdmin || isManager) && (
                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
              )}

            </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

            {products.length === 0 ? (

                <tr>
                  <td
                      colSpan={isAdmin || isManager ? 7 : 6}
                      className="py-12 text-center text-slate-500"
                  >
                    No Products Found
                  </td>
                </tr>

            ) : (

                products.map((product) => {
                  const imageUrl = getImageUrl(product.image);

                  return (
                      <tr
                          key={product.id}
                          className="hover:bg-slate-50 transition"
                      >

                        {/* Image */}
                        <td className="px-5 py-4">

                          {imageUrl ? (
                              <img
                                  key={product.image}
                                  src={imageUrl}
                                  alt={product.name}
                                  className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                              />
                          ) : (
                              <div className="w-14 h-14 flex items-center justify-center border border-slate-200 rounded-lg text-xs text-slate-400">
                                No Image
                              </div>
                          )}

                        </td>

                        {/* Name */}
                        <td className="px-5 py-4">

                      <span className="font-semibold text-slate-800">
                        {product.name}
                      </span>

                        </td>

                        {/* Description */}
                        <td className="px-5 py-4 max-w-xs">

                          <p className="text-sm text-slate-500 truncate">
                            {product.description}
                          </p>

                        </td>

                        {/* Vendor */}
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {product.vendorName}
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4">

                      <span className="font-semibold text-slate-700">
                        ₹{Number(product.price).toLocaleString()}
                      </span>

                        </td>

                        {/* Stock */}
                        <td className="px-5 py-4">

                      <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              product.stock > 10
                                  ? "bg-green-100 text-green-700"
                                  : product.stock > 0
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                          }`}
                      >
                        {product.stock} in stock
                      </span>

                        </td>

                        {/* Actions */}
                        {(isAdmin || isManager) && (

                            <td className="px-5 py-4">

                              <div className="flex justify-center gap-2">

                                <button
                                    onClick={() => handleEdit(product)}
                                    className="px-4 py-2 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium text-sm transition"
                                >
                                  Edit
                                </button>

                                {isAdmin && (
                                    <button
                                        onClick={() =>
                                            handleDelete(product.id)
                                        }
                                        className="px-4 py-2 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-medium text-sm transition"
                                    >
                                      Delete
                                    </button>
                                )}

                              </div>

                            </td>

                        )}

                      </tr>
                  );
                })

            )}

            </tbody>

          </table>

        </div>

      </div>
  );
}

export default ProductTable;