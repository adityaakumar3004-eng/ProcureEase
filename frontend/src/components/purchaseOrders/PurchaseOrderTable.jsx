import { useAuth } from "../../context/AuthContext";

function PurchaseOrderTable({
                                purchaseOrders,
                                handleStatusUpdate,
                            }) {
    const { isAdmin, isManager } = useAuth();

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "approved":
                return "bg-blue-50 text-blue-700 border-blue-200";

            case "rejected":
                return "bg-red-50 text-red-700 border-red-200";

            case "completed":
                return "bg-green-50 text-green-700 border-green-200";

            default:
                return "bg-amber-50 text-amber-700 border-amber-200";
        }
    };

    return (
        <div className="overflow-x-auto">

            <table className="min-w-full">

                <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        ID
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Vendor
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Total Amount
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Created At
                    </th>

                    {(isAdmin || isManager) && (
                        <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Actions
                        </th>
                    )}

                </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                {purchaseOrders.length === 0 ? (

                    <tr>

                        <td
                            colSpan={
                                isAdmin || isManager ? 6 : 5
                            }
                            className="text-center py-12 text-slate-500"
                        >
                            No Purchase Orders Found
                        </td>

                    </tr>

                ) : (

                    purchaseOrders.map((order) => (

                        <tr
                            key={order.id}
                            className="hover:bg-slate-50/70 transition"
                        >

                            <td className="px-6 py-4 font-medium text-slate-700">
                                #{order.id}
                            </td>

                            <td className="px-6 py-4 font-medium text-slate-700">
                                {order.vendorName}
                            </td>

                            <td className="px-6 py-4 text-slate-700">
                                ₹
                                {Number(
                                    order.totalAmount
                                ).toLocaleString()}
                            </td>

                            <td className="px-6 py-4">

                  <span
                      className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${getStatusStyle(
                          order.status
                      )}`}
                  >
                    {order.status}
                  </span>

                            </td>

                            <td className="px-6 py-4 text-slate-600">

                                {order.createdAt
                                    ? new Date(
                                        order.createdAt
                                    ).toLocaleDateString()
                                    : "-"}

                            </td>

                            {(isAdmin || isManager) && (

                                <td className="px-6 py-4">

                                    <div className="flex justify-center">

                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusUpdate(
                                                    order.id,
                                                    e.target.value
                                                )
                                            }
                                            className="border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

                                    </div>

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