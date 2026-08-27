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
    "/sales": "Sales",
    "/inventory": "Inventory",
    "/invoices": "Invoices",
    "/payments": "Payments",
    "/reports": "Reports",
    "/notifications": "Notifications",
    "/profile": "Profile",
  };

  const currentTitle =
      pageTitles[location.pathname] || "ProcureEase";

  const handleLogout = () => {

    logout();

    navigate("/");
  };

  const getInitial = () => {

    if (!user?.full_name) {
      return "A";
    }

    return user.full_name.charAt(0).toUpperCase();
  };

  return (
      <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-8 backdrop-blur">

        {/* Page Title */}
        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            {currentTitle}
          </h2>

        </div>


        {/* User Section */}
        <div className="flex items-center gap-5">

          {/* User Information */}
          <div className="flex items-center gap-3">

            {/* Avatar */}
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-base font-semibold text-white shadow-md">

              {getInitial()}

            </div>


            {/* Name and Role */}
            <div className="hidden text-left sm:block">

              <p className="font-semibold text-slate-800">
                {user?.full_name || "Admin"}
              </p>

              <p className="text-sm capitalize text-slate-500">
                {user?.role || "Administrator"}
              </p>

            </div>

          </div>


          {/* Divider */}
          <div className="hidden h-8 w-px bg-slate-200 sm:block" />


          {/* Logout Button */}
          <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-600 hover:shadow-md active:scale-95"
          >
            Logout
          </button>

        </div>

      </header>
  );
}

export default Navbar;