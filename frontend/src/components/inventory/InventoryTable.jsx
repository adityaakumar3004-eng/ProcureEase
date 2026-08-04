function InventoryTable({ products }) {
  return (
    <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">

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
            Status
          </th>

        </tr>

      </thead>

      <tbody>

        {products.map((product) => (

          <tr
            key={product.id}
            className="border-t hover:bg-gray-50"
          >

            <td className="px-6 py-4">
              {product.id}
            </td>

            <td className="px-6 py-4">
              {product.name}
            </td>

            <td className="px-6 py-4">
              {product.vendor_name}
            </td>

            <td className="px-6 py-4">
              ₹ {product.price}
            </td>

            <td className="px-6 py-4">
              {product.stock}
            </td>

            <td className="px-6 py-4">

              {product.stock <= 10
                ? "Low Stock"
                : "Healthy"}

            </td>

          </tr>

        ))}

      </tbody>

    </table>
  );
}

export default InventoryTable;