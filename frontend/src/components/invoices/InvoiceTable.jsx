function InvoiceTable({
  invoices,
  handleEdit,
  handleDelete,
  handleMarkPaid,
  isAdmin,
  isManager,
}) {
  return (
    <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left">ID</th>

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
        {invoices.map((invoice) => (
          <tr
            key={invoice.id}
            className="border-t hover:bg-gray-50"
          >
            <td className="px-6 py-4">
              {invoice.id}
            </td>

            <td className="px-6 py-4">
              {invoice.invoice_number}
            </td>

            <td className="px-6 py-4">
              {invoice.purchase_order_id}
            </td>

            <td className="px-6 py-4">
              {new Date(
                invoice.invoice_date
              ).toLocaleDateString()}
            </td>

            <td className="px-6 py-4">
              {invoice.status}
            </td>

            <td className="px-6 py-4">
              {invoice.payment_status}
            </td>

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
 invoice.payment_status !== "Paid" && (
                      <button
                        onClick={() =>
                          handleMarkPaid(
                            invoice.id
                          )
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
        ))}
      </tbody>
    </table>
  );
}

export default InvoiceTable;