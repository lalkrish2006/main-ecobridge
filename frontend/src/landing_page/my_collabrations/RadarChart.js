import React, { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = () => {
  const [collabs, setCollabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3002/user/collabs", { withCredentials: true })
      .then((res) => {
        setCollabs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user collaborations:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-4">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: ["Environmental", "Social", "Economic"],
    datasets: collabs.map((collab, index) => {
      return {
        label: collab.title,
        data: [
          Math.min((collab.environmentalImpact ?? 0.1) * 10, 10),
          Math.min((collab.socialImpact ?? 0.1) * 10, 10),
          Math.min((collab.economicImpact ?? 0.1) * 10, 10),
        ],
        backgroundColor: `rgba(0, 255, 127, 0.4)`, // A fixed background color with moderate opacity
        borderColor: `rgba(0, 255, 0, 0.7)`, // Border color for distinction
        borderWidth: 2,
        pointBackgroundColor: `rgba(0, 255, 0, 1)`, // Same green color for points
        pointBorderColor: "#fff", // White point border
      };
    }),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1,
          color: "#000", // Ticks color set to black for better readability
        },
        pointLabels: {
          color: "#000", // Set point labels to black
        },
        angleLines: {
          color: "#ddd", // Lighter color for angle lines
        },
        grid: {
          color: "#ddd", // Lighter grid lines
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#000", // Legend text color set to black for clarity
        },
      },
      tooltip: {
        backgroundColor: "#222", // Tooltip background color
        titleColor: "#fff", // Tooltip title color
        bodyColor: "#fff", // Tooltip body color
      },
    },
  };

  return (
    <div
      className="card p-4 rounded-4 shadow-lg"
      style={{
        height: "500px",
      }}
    >
      <h5 className="text-center mb-3" style={{ fontSize: "1.5rem", color: "#000" }}>
        Green Impact Radar
      </h5>
      <div className="position-relative" style={{ height: "100%" }}>
        <Radar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default RadarChart;
