function PaymentTable({ payments }) {
  return (
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left">
            ID
          </th>

          <th className="px-6 py-3 text-left">
            Invoice No.
          </th>

          <th className="px-6 py-3 text-left">
            Vendor
          </th>

          <th className="px-6 py-3 text-left">
            Purchase Order
          </th>

          <th className="px-6 py-3 text-left">
            Payment Method
          </th>

          <th className="px-6 py-3 text-left">
            Transaction ID
          </th>

          <th className="px-6 py-3 text-left">
            Payment Date
          </th>

          <th className="px-6 py-3 text-left">
            Payment Status
          </th>
        </tr>
        </thead>

        <tbody>
        {payments.length === 0 ? (
            <tr>
              <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500"
              >
                No payment records found.
              </td>
            </tr>
        ) : (
            payments.map((payment) => (
                <tr
                    key={payment.id}
                    className="border-t hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    {payment.id}
                  </td>

                  <td className="px-6 py-4">
                    {payment.invoiceNumber}
                  </td>

                  <td className="px-6 py-4">
                    {payment.vendorName || "-"}
                  </td>

                  <td className="px-6 py-4">
                    #{payment.purchaseOrderId}
                  </td>

                  <td className="px-6 py-4">
                    {payment.paymentMethod || "-"}
                  </td>

                  <td className="px-6 py-4">
                    {payment.transactionId || "-"}
                  </td>

                  <td className="px-6 py-4">
                    {payment.paymentDate
                        ? new Date(
                            payment.paymentDate
                        ).toLocaleDateString()
                        : "-"}
                  </td>

                  <td className="px-6 py-4">
                    {payment.paymentStatus}
                  </td>
                </tr>
            ))
        )}
        </tbody>
      </table>
  );
}

export default PaymentTable;