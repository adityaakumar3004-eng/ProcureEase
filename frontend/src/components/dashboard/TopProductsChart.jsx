import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
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

      // Backend directly returns a List
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
      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h2 className="text-2xl font-bold mb-6">
          Top Products
        </h2>

        <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                },
              },
            }}
        />
      </div>
  );
}

export default TopProductsChart;