import { useAuth } from "../../context/AuthContext";

function PurchaseOrderTable({
                              purchaseOrders,
                              handleStatusUpdate,
                            }) {
  const { isAdmin, isManager } = useAuth();

  return (
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full">

          <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left">
              ID
            </th>

            <th className="px-6 py-3 text-left">
              Vendor
            </th>

            <th className="px-6 py-3 text-left">
              Total Amount
            </th>

            <th className="px-6 py-3 text-left">
              Status
            </th>

            <th className="px-6 py-3 text-left">
              Created At
            </th>

            {(isAdmin || isManager) && (
                <th className="px-6 py-3 text-center">
                  Actions
                </th>
            )}
          </tr>
          </thead>

          <tbody>
          {purchaseOrders.length === 0 ? (
              <tr>
                <td
                    colSpan={
                      isAdmin || isManager ? 6 : 5
                    }
                    className="text-center py-8"
                >
                  No Purchase Orders Found
                </td>
              </tr>
          ) : (
              purchaseOrders.map((order) => (
                  <tr
                      key={order.id}
                      className="border-t hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      {order.id}
                    </td>

                    <td className="px-6 py-4">
                      {order.vendorName}
                    </td>

                    <td className="px-6 py-4">
                      ₹{" "}
                      {Number(
                          order.totalAmount
                      ).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      {order.status}
                    </td>

                    <td className="px-6 py-4">
                      {order.createdAt
                          ? new Date(
                              order.createdAt
                          ).toLocaleDateString()
                          : "-"}
                    </td>

                    {(isAdmin || isManager) && (
                        <td className="px-6 py-4">
                          <select
                              value={order.status}
                              onChange={(e) =>
                                  handleStatusUpdate(
                                      order.id,
                                      e.target.value
                                  )
                              }
                              className="border rounded-lg p-2"
                          >
                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Approved">
                              Approved
                            </option>

                            <option value="Rejected">
                              Rejected
                            </option>

                            <option value="Completed">
                              Completed
                            </option>
                          </select>
                        </td>
                    )}
                  </tr>
              ))
          )}
          </tbody>

        </table>
      </div>
  );
}

export default PurchaseOrderTable;