import { useAuth } from "../../context/AuthContext";

function VendorTable({
                         vendors,
                         handleEdit,
                         handleDelete,
                     }) {
    const { isAdmin, isManager } = useAuth();

    return (
        <table className="min-w-full">

            <thead className="bg-slate-50 border-b border-slate-200">

            <tr>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    ID
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Name
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Phone
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Address
                </th>

                {(isAdmin || isManager) && (
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                    </th>
                )}

            </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

            {vendors.length > 0 ? (

                vendors.map((vendor) => (

                    <tr
                        key={vendor.id}
                        className="transition hover:bg-slate-50"
                    >

                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-500">
                            #{vendor.id}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-800">
                            {vendor.name}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                            {vendor.email}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                            {vendor.phone}
                        </td>

                        <td className="max-w-xs px-6 py-4 text-sm text-slate-600">
                <span className="block truncate">
                  {vendor.address}
                </span>
                        </td>

                        {(isAdmin || isManager) && (

                            <td className="whitespace-nowrap px-6 py-4">

                                <div className="flex justify-center gap-2">

                                    <button
                                        onClick={() => handleEdit(vendor)}
                                        className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                                    >
                                        Edit
                                    </button>

                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(vendor.id)}
                                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                                        >
                                            Delete
                                        </button>
                                    )}

                                </div>

                            </td>

                        )}

                    </tr>

                ))

            ) : (

                <tr>

                    <td
                        colSpan={
                            isAdmin || isManager
                                ? 6
                                : 5
                        }
                        className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                        No vendors found.
                    </td>

                </tr>

            )}

            </tbody>

        </table>
    );
}

export default VendorTable;