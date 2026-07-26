import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/vendors": "Vendors",
    "/products": "Products",
    "/purchase-orders": "Purchase Orders",
    "/inventory": "Inventory",
    "/invoices": "Invoices",
    "/payments": "Payments",
    "/reports": "Reports",
    "/notifications": "Notifications",
    "/profile": "Profile",
  };

  const currentTitle = pageTitles[location.pathname] || "ProcureEase";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
      <h2 className="text-2xl font-semibold">
        {currentTitle}
      </h2>

      <div className="flex items-center gap-5">
        <div className="text-right">
          <p className="font-semibold">{user?.full_name}</p>
          <p className="text-sm text-gray-500 capitalize">
            {user?.role}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;