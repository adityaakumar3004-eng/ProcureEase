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
        <aside className="sticky top-0 flex h-screen w-80 flex-col bg-slate-900 text-white shadow-xl">

            {/* Logo */}
            <div className="border-b border-slate-800 px-8 py-7">

                <h1 className="text-3xl font-bold tracking-tight">
                    Procure<span className="text-blue-400">Ease</span>
                </h1>

                <p className="mt-1.5 text-sm text-slate-400">
                    Procurement Management
                </p>

            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-7">

                <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Main Menu
                </p>

                <div className="space-y-1.5">

                    {menuItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `group relative flex items-center rounded-lg px-5 py-3 text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <span className="absolute left-0 h-7 w-1 rounded-r-full bg-blue-300" />
                                    )}

                                    {item.name}
                                </>
                            )}

                        </NavLink>

                    ))}

                </div>

            </nav>

            {/* Bottom Branding */}
            <div className="border-t border-slate-800 px-8 py-5">

                <p className="text-sm font-medium text-slate-400">
                    ProcureEase
                </p>

                <p className="mt-1 text-xs text-slate-600">
                    Procurement made simple
                </p>

            </div>

        </aside>
    );
}

export default Sidebar;