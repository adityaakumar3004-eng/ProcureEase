function PaymentTable({ payments }) {

    return (

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">

            <table className="min-w-full">

                {/* Table Header */}

                <thead className="bg-gray-50 border-b border-gray-200">

                <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        ID
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Invoice No.
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Vendor
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Purchase Order
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Payment Method
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Transaction ID
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Payment Date
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Payment Status
                    </th>

                </tr>

                </thead>

                {/* Table Body */}

                <tbody>

                {payments.length === 0 ? (

                    <tr>

                        <td
                            colSpan="8"
                            className="text-center py-10 text-gray-500"
                        >
                            No payment records found.
                        </td>

                    </tr>

                ) : (

                    payments.map((payment) => (

                        <tr
                            key={payment.id}
                            className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                        >

                            {/* ID */}

                            <td className="px-6 py-4 text-gray-600">
                                {payment.id}
                            </td>

                            {/* Invoice Number */}

                            <td className="px-6 py-4 font-medium text-gray-800">
                                {payment.invoiceNumber || "-"}
                            </td>

                            {/* Vendor */}

                            <td className="px-6 py-4 text-gray-600">
                                {payment.vendorName || "-"}
                            </td>

                            {/* Purchase Order */}

                            <td className="px-6 py-4 text-gray-600">
                                {payment.purchaseOrderId
                                    ? `#${payment.purchaseOrderId}`
                                    : "-"}
                            </td>

                            {/* Payment Method */}

                            <td className="px-6 py-4 text-gray-600">
                                {payment.paymentMethod || "-"}
                            </td>

                            {/* Transaction ID */}

                            <td className="px-6 py-4 text-gray-600">
                                {payment.transactionId || "-"}
                            </td>

                            {/* Payment Date */}

                            <td className="px-6 py-4 text-gray-600">

                                {payment.paymentDate
                                    ? new Date(
                                        payment.paymentDate
                                    ).toLocaleDateString()
                                    : "-"}

                            </td>

                            {/* Payment Status */}

                            <td className="px-6 py-4">

                                    <span
                                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                            payment.paymentStatus === "Paid"
                                                ? "bg-green-100 text-green-700"
                                                : payment.paymentStatus === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : payment.paymentStatus === "Failed"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {payment.paymentStatus || "-"}
                                    </span>

                            </td>

                        </tr>

                    ))

                )}

                </tbody>

            </table>

        </div>

    );
}

export default PaymentTable;