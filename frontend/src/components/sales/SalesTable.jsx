function SalesTable({ sales }) {
    return (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full border-collapse">

                <thead className="bg-gray-100">
                <tr>
                    <th className="px-6 py-3 text-left">
                        ID
                    </th>

                    <th className="px-6 py-3 text-left">
                        Product
                    </th>

                    <th className="px-6 py-3 text-left">
                        Quantity
                    </th>

                    <th className="px-6 py-3 text-left">
                        Price
                    </th>

                    <th className="px-6 py-3 text-left">
                        Total Amount
                    </th>

                    <th className="px-6 py-3 text-left">
                        Sale Date
                    </th>
                </tr>
                </thead>

                <tbody>
                {sales.length === 0 ? (
                    <tr>
                        <td
                            colSpan="6"
                            className="text-center py-8 text-gray-500"
                        >
                            No Sales Found
                        </td>
                    </tr>
                ) : (
                    sales.map((sale) => (
                        <tr
                            key={sale.id}
                            className="border-t hover:bg-gray-50"
                        >
                            <td className="px-6 py-4">
                                {sale.id}
                            </td>

                            <td className="px-6 py-4">
                                {sale.productName}
                            </td>

                            <td className="px-6 py-4">
                                {sale.quantity}
                            </td>

                            <td className="px-6 py-4">
                                ₹{Number(sale.price).toLocaleString()}
                            </td>

                            <td className="px-6 py-4 font-medium">
                                ₹{Number(sale.totalAmount).toLocaleString()}
                            </td>

                            <td className="px-6 py-4">
                                {sale.createdAt
                                    ? new Date(
                                        sale.createdAt
                                    ).toLocaleDateString()
                                    : "-"}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>

            </table>
        </div>
    );
}

export default SalesTable;