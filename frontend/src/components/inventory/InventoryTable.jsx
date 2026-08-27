function InventoryTable({ products }) {

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        className:
            "bg-red-100 text-red-700",
      };
    }

    if (stock <= 10) {
      return {
        label: "Low Stock",
        className:
            "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      label: "Healthy",
      className:
          "bg-green-100 text-green-700",
    };
  };

  return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-50 border-b border-gray-200">

          <tr>

            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              ID
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Product
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Vendor
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Price
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Stock
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Inventory Value
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
              Status
            </th>

          </tr>

          </thead>

          <tbody>

          {products.length === 0 ? (

              <tr>

                <td
                    colSpan="7"
                    className="text-center py-10 text-gray-500"
                >
                  No Products Found
                </td>

              </tr>

          ) : (

              products.map((product) => {

                const stock =
                    Number(product.stock || 0);

                const price =
                    Number(product.price || 0);

                const inventoryValue =
                    price * stock;

                const vendorName =
                    product.vendorName ||
                    product.vendor_name ||
                    "-";

                const status =
                    getStockStatus(stock);

                return (

                    <tr
                        key={product.id}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                    >

                      {/* ID */}
                      <td className="px-6 py-4 text-gray-700">
                        #{product.id}
                      </td>

                      {/* Product */}
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {product.name}
                      </td>

                      {/* Vendor */}
                      <td className="px-6 py-4 text-gray-700">
                        {vendorName}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-gray-700">
                        ₹{price.toLocaleString()}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4 text-gray-700">
                        {stock.toLocaleString()}
                      </td>

                      {/* Inventory Value */}
                      <td className="px-6 py-4 text-gray-700">
                        ₹{inventoryValue.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">

                    <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>

                      </td>

                    </tr>

                );
              })

          )}

          </tbody>

        </table>

      </div>
  );
}

export default InventoryTable;