function InvoiceTable({
                          invoices,
                          handleEdit,
                          handleDelete,
                          handleMarkPaid,
                          isAdmin,
                          isManager,
                      }) {
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
                        Purchase Order
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Date
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Payment
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                        Actions
                    </th>

                </tr>

                </thead>

                {/* Table Body */}
                <tbody>

                {invoices.length === 0 ? (

                    <tr>

                        <td
                            colSpan="7"
                            className="text-center py-10 text-gray-500"
                        >
                            No invoices found
                        </td>

                    </tr>

                ) : (

                    invoices.map((invoice) => (

                        <tr
                            key={invoice.id}
                            className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                        >

                            {/* ID */}
                            <td className="px-6 py-4 text-gray-600">
                                {invoice.id}
                            </td>

                            {/* Invoice Number */}
                            <td className="px-6 py-4 font-medium text-gray-800">
                                {invoice.invoiceNumber}
                            </td>

                            {/* Purchase Order */}
                            <td className="px-6 py-4 text-gray-600">
                                #{invoice.purchaseOrderId}
                            </td>

                            {/* Invoice Date */}
                            <td className="px-6 py-4 text-gray-600">

                                {invoice.invoiceDate
                                    ? new Date(
                                        invoice.invoiceDate
                                    ).toLocaleDateString()
                                    : "-"}

                            </td>

                            {/* Invoice Status */}
                            <td className="px-6 py-4">

                  <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          invoice.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : invoice.status === "Rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {invoice.status}
                  </span>

                            </td>

                            {/* Payment Status */}
                            <td className="px-6 py-4">

                  <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          invoice.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                      }`}
                  >
                    {invoice.paymentStatus}
                  </span>

                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">

                                <div className="flex justify-center items-center gap-2">

                                    {(isAdmin || isManager) && (
                                        <>

                                            {/* Edit Button */}
                                            <button
                                                onClick={() =>
                                                    handleEdit(invoice)
                                                }
                                                className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                                            >
                                                Edit
                                            </button>

                                            {/* Mark Paid Button */}
                                            {invoice.status === "Approved" &&
                                                invoice.paymentStatus !== "Paid" && (

                                                    <button
                                                        onClick={() =>
                                                            handleMarkPaid(invoice.id)
                                                        }
                                                        className="px-4 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                                                    >
                                                        Mark Paid
                                                    </button>

                                                )}

                                        </>
                                    )}

                                    {/* Delete Button */}
                                    {isAdmin && (

                                        <button
                                            onClick={() =>
                                                handleDelete(invoice.id)
                                            }
                                            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
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

export default InvoiceTable;