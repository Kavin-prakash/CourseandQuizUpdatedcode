import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components with ChartJS
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const LineGraph = () => {
  // Data from the swagger example
  const data = [
    {
      "score": 6,
      "courseTitle": "LINQ",
      "learnerId": "6bdbab27-c637-48ff-850e-2cf9eb700a40",
      "topicName": "LINQ Queries",
      "topicId": "2df47ffa-3fc0-44c7-b869-c403f5542150",
      "courseId": "7c0fb527-547d-4e1c-8855-24c0b43911f0",
      "passMark": 10,
      "createdat": "2024-01-01T00:00:00"
    },
    {
      "score": 10,
      "courseTitle": "LINQ",
      "learnerId": "6bdbab27-c637-48ff-850e-2cf9eb700a40",
      "topicName": "LINQ Queries",
      "topicId": "2df47ffa-3fc0-44c7-b869-c403f5542150",
      "courseId": "7c0fb527-547d-4e1c-8855-24c0b43911f0",
      "passMark": 10,
      "createdat": "2024-02-04T00:00:00"
    }
  ];

  // Prepare the data for the chart
  const chartData = {
    labels: data.map(entry => new Date(entry.createdat).toLocaleDateString()), // Format dates as strings
    datasets: [
      {
        label: 'Scores',
        data: data.map(entry => entry.score),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      }
    ]
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Scores Over Time'
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'll',
          displayFormats: {
            day: 'MMM D'
          }
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Score'
        },
        beginAtZero: true,
        min: 0,
        max: 10
      }
    }
  };

  return (
    <div>
      <h2>Line Graph</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineGraph;