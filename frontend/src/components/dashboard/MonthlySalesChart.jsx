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

function MonthlySalesChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetchMonthlySales();
  }, []);

  const fetchMonthlySales = async () => {
    try {
      const response = await api.get("/dashboard/monthly-sales");

      // Backend directly returns a List
      const labels = response.data.map((item) => item.month);
      const sales = response.data.map((item) => item.sales);

      setChartData({
        labels,
        datasets: [
          {
            label: "Monthly Sales",
            data: sales,
            borderColor: "#2563eb",
            backgroundColor: "#93c5fd",
            tension: 0.4,
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching monthly sales:", error);
    }
  };

  return (
      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h2 className="text-2xl font-bold mb-6">
          Monthly Sales
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
                    callback: function (value) {
                      return "₹" + value.toLocaleString();
                    },
                  },
                },
              },
            }}
        />
      </div>
  );
}

export default MonthlySalesChart;