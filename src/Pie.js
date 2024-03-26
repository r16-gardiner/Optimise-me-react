import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }) {
  // Preprocess data to group certain categories
  const processedData = {
    "Work": 0, // Initialize "Work" to accumulate all related activities
    // Other categories can be initialized here if needed
    // "Exercise": 0, 
    // "Sleep": 0, etc.
  };

  // Categories to group into "Work"
  const workCategories = ["Work", "Revision", "Workshop", "Lecture", "Lab"];

  Object.entries(data).forEach(([key, value]) => {
    if (workCategories.includes(key)) {
      processedData["Work"] += value; // Sum values for grouped categories
    } else {
      // Retain other categories as they are
      processedData[key] = value;
    }
  });

  const sortedActivitiesDesc = Object.fromEntries(
    Object.entries(processedData).sort((a, b) => b[1] - a[1])
);

const totalHours = Object.values(sortedActivitiesDesc).reduce((acc, cur) => acc + cur, 0);
  
// Generate chart data using processedData
const chartData = {
  labels: Object.keys(sortedActivitiesDesc),
  datasets: [
    {
      data: Object.values(sortedActivitiesDesc),
      backgroundColor: [
        // Ensure there are enough colors for each category
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF3D67',
        '#C9CBCF',
        '#7BC043',
        '#F49AC2',
        // Add more colors if needed
      ],
      hoverBackgroundColor: [
        // Same as backgroundColor for simplicity, add more if needed
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF3D67',
        '#C9CBCF',
        '#7BC043',
        '#F49AC2',
      ],
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 15 }, 
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          const percentage = ((value / totalHours * 100) >5) ? `${(value / totalHours * 100).toFixed(2)}%` : "";
          
          return percentage;
        }
      }
    }
  ]
};
ChartJS.register(ChartDataLabels);



return <Pie data={chartData} />;
}