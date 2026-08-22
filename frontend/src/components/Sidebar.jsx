import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Vendors", path: "/vendors" },
    { name: "Products", path: "/products" },
    { name: "Purchase Orders", path: "/purchase-orders" },
    { name: "Sales", path: "/sales" },
    { name: "Inventory", path: "/inventory" },
    { name: "Invoices", path: "/invoices" },
    { name: "Payments", path: "/payments" },
    { name: "Reports", path: "/reports" },
    { name: "Notifications", path: "/notifications" },
    { name: "Profile", path: "/profile" },
  ];

  return (
      <aside className="w-72 bg-slate-900 text-white min-h-screen sticky top-0 shadow-xl">

        {/* Logo */}
        <div className="border-b border-slate-700 px-8 py-7">
          <h1 className="text-4xl font-bold tracking-wide">
            ProcureEase
          </h1>
        </div>

        {/* Menu */}
        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
              <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                      `block rounded-xl px-5 py-3 text-lg font-medium transition-all duration-200 ${
                          isActive
                              ? "bg-blue-600 shadow-md"
                              : "hover:bg-slate-800 hover:translate-x-1"
                      }`
                  }
              >
                {item.name}
              </NavLink>
          ))}
        </nav>

      </aside>
  );
}

export default Sidebar;