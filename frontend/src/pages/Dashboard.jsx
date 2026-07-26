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
    return <h2>Loading Dashboard...</h2>;
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <DashboardCard
          title="Total Vendors"
          value={dashboard.vendors}
          color="text-blue-600"
        />

        <DashboardCard
          title="Total Products"
          value={dashboard.products}
          color="text-green-600"
        />

        <DashboardCard
          title="Purchase Orders"
          value={dashboard.purchaseOrders}
          color="text-purple-600"
        />

        <DashboardCard
          title="Sales"
          value={dashboard.sales}
          color="text-orange-600"
        />

        <DashboardCard
          title="Inventory Value"
          value={`₹${dashboard.inventoryValue}`}
          color="text-indigo-600"
        />

        <DashboardCard
          title="Low Stock Products"
          value={dashboard.lowStockProducts.length}
          color="text-red-600"
        />

      </div>

      <MonthlySalesChart />
      <PurchaseTrendChart />
      <TopProductsChart />
      <InventoryDistributionChart />

    </div>
  );
}

export default Dashboard;