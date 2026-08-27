import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

function TopProductsChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const response = await api.get("/dashboard/top-products");

      const labels = response.data.map((item) => item.product);
      const quantities = response.data.map((item) => item.quantity);

      setChartData({
        labels,
        datasets: [
          {
            label: "Quantity Sold",
            data: quantities,
            backgroundColor: "#8b5cf6",
            borderRadius: 6,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching top products:", error);
    }
  };

  return (
      <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm mt-8">

        <h2 className="text-xl font-semibold text-slate-800 mb-6">
          Top Products
        </h2>

        <div className="h-[350px]">
          <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                    grid: {
                      color: "#e2e8f0",
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
          />
        </div>

      </div>
  );
}

export default TopProductsChart;