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
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
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

      const response = await api.get(
          "/dashboard/purchase-trends"
      );

      const labels = response.data.map(
          (item) => item.month
      );

      const purchases = response.data.map(
          (item) => item.purchases
      );

      setChartData({
        labels,
        datasets: [
          {
            label: "Purchase Orders",
            data: purchases,
            borderColor: "#7c3aed",
            backgroundColor: "rgba(124, 58, 237, 0.12)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,

            pointBackgroundColor: "#ffffff",
            pointBorderColor: "#7c3aed",
            pointBorderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      });

    } catch (error) {

      console.error(
          "Error fetching purchase trends:",
          error
      );

    }

  };

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false,
      },

      title: {
        display: false,
      },

      tooltip: {

        backgroundColor: "#0f172a",

        padding: 12,

        titleFont: {
          size: 13,
        },

        bodyFont: {
          size: 13,
        },

        callbacks: {

          label: function (context) {

            return (
                " Purchase Orders: " +
                context.parsed.y
            );

          },

        },

      },

    },

    interaction: {
      intersect: false,
      mode: "index",
    },

    scales: {

      x: {

        grid: {
          display: false,
        },

        border: {
          display: false,
        },

        ticks: {
          color: "#64748b",
          font: {
            size: 12,
          },
        },

      },

      y: {

        beginAtZero: true,

        grid: {
          color: "#e2e8f0",
        },

        border: {
          display: false,
        },

        ticks: {

          precision: 0,

          color: "#64748b",

          font: {
            size: 12,
          },

        },

      },

    },

  };

  return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">

        {/* Chart Header */}

        <div className="mb-6 flex items-start justify-between">

          <div>

            <h2 className="text-lg font-bold text-slate-800">
              Purchase Trend
            </h2>

          </div>


          {/* Chart Indicator */}

          <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2">

            <span className="h-2.5 w-2.5 rounded-full bg-purple-600" />

            <span className="text-xs font-medium text-purple-700">
                        Purchase Orders
                    </span>

          </div>

        </div>


        {/* Chart */}

        <div className="h-[320px]">

          <Line
              data={chartData}
              options={options}
          />

        </div>

      </div>
  );
}

export default PurchaseTrendChart;