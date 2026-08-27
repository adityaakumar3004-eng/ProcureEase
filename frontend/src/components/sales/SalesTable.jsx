function SalesTable({ sales }) {

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
                        Quantity
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Price
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Total Amount
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Sale Date
                    </th>

                </tr>

                </thead>

                <tbody>

                {sales.length === 0 ? (

                    <tr>

                        <td
                            colSpan="6"
                            className="text-center py-10 text-gray-500"
                        >
                            No Sales Found
                        </td>

                    </tr>

                ) : (

                    sales.map((sale) => (

                        <tr
                            key={sale.id}
                            className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                        >

                            <td className="px-6 py-4 text-gray-700">
                                #{sale.id}
                            </td>

                            <td className="px-6 py-4 font-medium text-gray-800">
                                {sale.productName}
                            </td>

                            <td className="px-6 py-4 text-gray-700">
                                {sale.quantity}
                            </td>

                            <td className="px-6 py-4 text-gray-700">
                                ₹{Number(sale.price).toLocaleString()}
                            </td>

                            <td className="px-6 py-4 text-gray-700">
                                ₹{Number(sale.totalAmount).toLocaleString()}
                            </td>

                            <td className="px-6 py-4 text-gray-600">
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