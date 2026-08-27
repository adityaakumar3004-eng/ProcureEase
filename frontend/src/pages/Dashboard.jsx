import { useEffect, useState } from "react";
import api from "../services/api";

import DashboardCard from "../components/dashboard/DashboardCard";
import MonthlySalesChart from "../components/dashboard/MonthlySalesChart";
import PurchaseTrendChart from "../components/dashboard/PurchaseTrendChart";
import TopProductsChart from "../components/dashboard/TopProductsChart";
import InventoryDistributionChart from "../components/dashboard/InventoryDistributionChart";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard");

      setDashboard(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="font-medium text-slate-500">
              Loading dashboard...
            </p>
          </div>
        </div>
    );
  }

  return (
      <div className="mx-auto max-w-[1600px]">

        {/* Statistics Cards */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <DashboardCard
              title="Total Vendors"
              value={dashboard?.vendors ?? 0}
              color="text-blue-600"
          />

          <DashboardCard
              title="Total Products"
              value={dashboard?.products ?? 0}
              color="text-green-600"
          />

          <DashboardCard
              title="Purchase Orders"
              value={dashboard?.purchaseOrders ?? 0}
              color="text-purple-600"
          />

          <DashboardCard
              title="Sales"
              value={dashboard?.sales ?? 0}
              color="text-orange-600"
          />

          <DashboardCard
              title="Inventory Value"
              value={`₹${dashboard?.inventoryValue ?? 0}`}
              color="text-indigo-600"
          />

          <DashboardCard
              title="Low Stock Products"
              value={dashboard?.lowStockProducts?.length ?? 0}
              color="text-red-600"
          />
        </div>

        {/* Analytics Section */}

        <div className="mt-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Analytics
            </h2>
          </div>

          {/* Charts */}

          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
            <MonthlySalesChart />

            <PurchaseTrendChart />

            <TopProductsChart />

            <InventoryDistributionChart />
          </div>
        </div>

      </div>
  );
}

export default Dashboard;