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

      const response = await api.get(
          "/dashboard/monthly-sales"
      );

      const labels = response.data.map(
          (item) => item.month
      );

      const sales = response.data.map(
          (item) => item.sales
      );

      setChartData({
        labels,
        datasets: [
          {
            label: "Monthly Sales",
            data: sales,
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.12)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,

            pointBackgroundColor: "#ffffff",
            pointBorderColor: "#2563eb",
            pointBorderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      });

    } catch (error) {

      console.error(
          "Error fetching monthly sales:",
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
                " Sales: ₹" +
                context.parsed.y.toLocaleString()
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

          color: "#64748b",

          font: {
            size: 12,
          },

          callback: function (value) {

            return (
                "₹" +
                value.toLocaleString()
            );

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

              Monthly Sales

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              Sales performance over recent months

            </p>

          </div>


          {/* Chart Indicator */}

          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">

            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />

            <span className="text-xs font-medium text-blue-700">

                        Sales

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

export default MonthlySalesChart;