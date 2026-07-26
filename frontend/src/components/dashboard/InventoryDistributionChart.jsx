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

      const labels = response.data.data.map(
        (item) => item.category
      );

      const counts = response.data.data.map(
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
            borderWidth: 1,
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
    <div className="bg-white p-6 rounded-xl shadow mt-8">
      <h2 className="text-2xl font-bold mb-6">
        Inventory Distribution
      </h2>

      <Doughnut
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        }}
      />
    </div>
  );
}

export default InventoryDistributionChart;