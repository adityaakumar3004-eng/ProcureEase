import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout() {
    return (
        <div className="flex min-h-screen bg-slate-50">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Area */}
            <div className="flex min-w-0 flex-1 flex-col">

                {/* Navbar */}
                <Navbar />

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default MainLayout;