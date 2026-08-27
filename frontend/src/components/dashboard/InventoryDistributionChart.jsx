import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function InventoryDistributionChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetchInventoryDistribution();
  }, []);

  const fetchInventoryDistribution = async () => {
    try {
      const response = await api.get(
          "/dashboard/inventory-distribution"
      );

      const labels = response.data.map(
          (item) => item.category
      );

      const counts = response.data.map(
          (item) => item.count
      );

      setChartData({
        labels,
        datasets: [
          {
            data: counts,
            backgroundColor: [
              "#22c55e",
              "#ef4444",
            ],
            borderColor: "#ffffff",
            borderWidth: 4,
            hoverOffset: 8,
          },
        ],
      });
    } catch (error) {
      console.error(
          "Error fetching inventory distribution:",
          error
      );
    }
  };

  return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">
          Inventory Distribution
        </h2>

        <div className="h-[350px] flex items-center justify-center">
          <Doughnut
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "65%",
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      usePointStyle: true,
                      boxWidth: 10,
                      padding: 20,
                    },
                  },
                },
              }}
          />
        </div>
      </div>
  );
}

export default InventoryDistributionChart;