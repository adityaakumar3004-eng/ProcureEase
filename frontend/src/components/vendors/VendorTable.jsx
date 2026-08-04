import { useAuth } from "../../context/AuthContext";

function VendorTable({
  vendors,
  handleEdit,
  handleDelete,
}) {

  const { isAdmin, isManager } = useAuth();

  return (
    <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">

      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left">ID</th>
          <th className="px-6 py-3 text-left">Name</th>
          <th className="px-6 py-3 text-left">Email</th>
          <th className="px-6 py-3 text-left">Phone</th>
          <th className="px-6 py-3 text-left">Address</th>

          {(isAdmin || isManager) && (
            <th className="px-6 py-3 text-center">
              Actions
            </th>
          )}

        </tr>
      </thead>

      <tbody>

        {vendors.map((vendor) => (

          <tr
            key={vendor.id}
            className="border-t hover:bg-gray-50"
          >

            <td className="px-6 py-4">
              {vendor.id}
            </td>

            <td className="px-6 py-4">
              {vendor.name}
            </td>

            <td className="px-6 py-4">
              {vendor.email}
            </td>

            <td className="px-6 py-4">
              {vendor.phone}
            </td>

            <td className="px-6 py-4">
              {vendor.address}
            </td>

            {(isAdmin || isManager) && (

              <td className="px-6 py-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => handleEdit(vendor)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Edit
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(vendor.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Delete
                    </button>
                  )}

                </div>

              </td>

            )}

          </tr>

        ))}

      </tbody>

    </table>
  );
}

export default VendorTable;