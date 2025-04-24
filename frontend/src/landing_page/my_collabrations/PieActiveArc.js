import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function PieActiveArc() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await axios.get("http://localhost:3002/user/collabs", {
          withCredentials: true,
        });

        console.log("Authenticated User's Collaborations:", res.data);

        const filteredData = res.data.filter(item => item.greenScore !== undefined);

        const labels = filteredData.map(item => item.title);
        const data = filteredData.map(item => item.greenScore);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Green Scores',
              data,
              backgroundColor: labels.map(
                (_, i) => `hsl(${(i * 360) / labels.length}, 70%, 60%)`
              ),
              borderColor: '#fff',
              borderWidth: 2,
              hoverOffset: 10,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching user collaboration green scores:", err);
      }
    };

    fetchScores();
  }, []);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      datalabels: {
        display: false,
      },
    },
  };

  if (!chartData) return <p className="text-center">Loading your impact chart...</p>;

  return (
    <div
      className="card shadow-sm p-3 d-flex flex-column align-items-center"
      style={{ height: '50vh', width: '50vh' }}
    >
      <h6 className="text-center mb-2">Your Collaborations' Green Scores</h6>
      <div style={{ flex: 1, width: '100%' }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}
