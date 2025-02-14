import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';
import './Home.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Home() {
  const [numberCounts, setNumberCounts] = useState({});

  useEffect(() => {
    fetchNumberCounts();
  }, []);

  const fetchNumberCounts = async () => {
    try {
      const response = await axios.get('https://energy-monitor-fastapi-production.up.railway.app/report/');
      setNumberCounts(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const chartData = {
    labels: ["Электроэнергия"],
    datasets: [
      {
        label: "Энергии потрачено, Вт",
        data: [numberCounts["1"] || 0],
        backgroundColor: 'rgba(255, 46, 102, 0.8)'
      },
      {
        label: "Энергии получено, Вт",
        data: [numberCounts["2"] || 0],
        backgroundColor: 'rgba(60, 255, 23, 0.88)'
      },
      {
        label: "Энергии взято из сети, Вт",
        data: [numberCounts["3"] || 0],
        backgroundColor: 'rgba(228, 23, 255, 0.88)'
      },
      {
        label: "Энергии отдано в сеть, Вт",
        data: [numberCounts["4"] || 0],
        backgroundColor: 'rgba(109, 238, 129, 0.88)'
      }
    ],
  };

  return (
    <div className="container">
      <nav className="nav-bar">
        <Link to="/" className="nav-button">Главная</Link>
        <Link to="/report-by-date" className="nav-button">Отчёт по дате</Link>
      </nav>

      <h1 className="title">Добро пожаловать!</h1>

      <div className="chart-container">
        <Bar data={chartData} />
      </div>
    </div>
  );
}

export default Home;
