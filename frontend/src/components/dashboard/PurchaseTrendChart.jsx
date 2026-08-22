import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function PurchaseTrendChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetchPurchaseTrends();
  }, []);

  const fetchPurchaseTrends = async () => {
    try {
      const response = await api.get("/dashboard/purchase-trends");

      // Backend directly returns a List
      const labels = response.data.map((item) => item.month);
      const purchases = response.data.map((item) => item.purchases);

      setChartData({
        labels,
        datasets: [
          {
            label: "Purchase Orders",
            data: purchases,
            borderColor: "#16a34a",
            backgroundColor: "#86efac",
            tension: 0.4,
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching purchase trends:", error);
    }
  };

  return (
      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h2 className="text-2xl font-bold mb-6">
          Purchase Trends
        </h2>

        <Line
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

export default PurchaseTrendChart;