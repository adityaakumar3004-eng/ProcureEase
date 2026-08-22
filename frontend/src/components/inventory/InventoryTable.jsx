function InventoryTable({ products }) {
  return (
      <div className="bg-white shadow rounded-lg overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-100">

          <tr>

            <th className="px-6 py-3 text-left">
              ID
            </th>

            <th className="px-6 py-3 text-left">
              Product
            </th>

            <th className="px-6 py-3 text-left">
              Vendor
            </th>

            <th className="px-6 py-3 text-left">
              Price
            </th>

            <th className="px-6 py-3 text-left">
              Stock
            </th>

            <th className="px-6 py-3 text-left">
              Inventory Value
            </th>

            <th className="px-6 py-3 text-left">
              Status
            </th>

          </tr>

          </thead>

          <tbody>

          {products.length === 0 ? (

              <tr>
                <td
                    colSpan="7"
                    className="text-center py-8 text-gray-500"
                >
                  No products found
                </td>
              </tr>

          ) : (

              products.map((product) => {

                const inventoryValue =
                    Number(product.price || 0) *
                    Number(product.stock || 0);

                const stock =
                    Number(product.stock || 0);

                return (

                    <tr
                        key={product.id}
                        className="border-t hover:bg-gray-50"
                    >

                      {/* ID */}
                      <td className="px-6 py-4">
                        {product.id}
                      </td>

                      {/* Product */}
                      <td className="px-6 py-4 font-medium">
                        {product.name}
                      </td>

                      {/* Vendor */}
                      <td className="px-6 py-4">
                        {product.vendor_name}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        ₹{Number(product.price).toLocaleString()}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        {stock}
                      </td>

                      {/* Inventory Value */}
                      <td className="px-6 py-4 font-medium">
                        ₹{inventoryValue.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">

                        {stock === 0 ? (

                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                        Out of Stock
                      </span>

                        ) : stock <= 10 ? (

                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                        Low Stock
                      </span>

                        ) : (

                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Healthy
                      </span>

                        )}

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