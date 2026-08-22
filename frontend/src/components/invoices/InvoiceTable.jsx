function InvoiceTable({
                        invoices,
                        handleEdit,
                        handleDelete,
                        handleMarkPaid,
                        isAdmin,
                        isManager,
                      }) {
  return (
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full">

          <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left">
              ID
            </th>

            <th className="px-6 py-3 text-left">
              Invoice No.
            </th>

            <th className="px-6 py-3 text-left">
              Purchase Order
            </th>

            <th className="px-6 py-3 text-left">
              Date
            </th>

            <th className="px-6 py-3 text-left">
              Status
            </th>

            <th className="px-6 py-3 text-left">
              Payment
            </th>

            <th className="px-6 py-3 text-center">
              Actions
            </th>
          </tr>
          </thead>

          <tbody>
          {invoices.length === 0 ? (
              <tr>
                <td
                    colSpan="7"
                    className="text-center py-8 text-gray-500"
                >
                  No invoices found
                </td>
              </tr>
          ) : (
              invoices.map((invoice) => (
                  <tr
                      key={invoice.id}
                      className="border-t hover:bg-gray-50"
                  >
                    {/* ID */}
                    <td className="px-6 py-4">
                      {invoice.id}
                    </td>

                    {/* Invoice Number */}
                    <td className="px-6 py-4">
                      {invoice.invoiceNumber}
                    </td>

                    {/* Purchase Order */}
                    <td className="px-6 py-4">
                      #{invoice.purchaseOrderId}
                    </td>

                    {/* Invoice Date */}
                    <td className="px-6 py-4">
                      {invoice.invoiceDate
                          ? new Date(
                              invoice.invoiceDate
                          ).toLocaleDateString()
                          : "-"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                  <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                      <div className="flex justify-center gap-2">

                        {(isAdmin || isManager) && (
                            <>
                              <button
                                  onClick={() =>
                                      handleEdit(invoice)
                                  }
                                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                              >
                                Edit
                              </button>

                              {invoice.status === "Approved" &&
                                  invoice.paymentStatus !== "Paid" && (
                                      <button
                                          onClick={() =>
                                              handleMarkPaid(invoice.id)
                                          }
                                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                                      >
                                        Mark Paid
                                      </button>
                                  )}
                            </>
                        )}

                        {isAdmin && (
                            <button
                                onClick={() =>
                                    handleDelete(invoice.id)
                                }
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
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