import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';
import './ReportByDate.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ReportByDatePage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [groupBy, setGroupBy] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let url = `https://energy-monitor-fastapi-production.up.railway.app/report_by_date/?start_date=${startDate}&end_date=${endDate}`;
      if (groupBy !== '') {
        url += `&group_by=${groupBy}`;
      }
      console.log("Fetching report with URL:", url);
      const response = await axios.get(url);
      console.log("Response data:", response.data);
      setReportData(response.data);
    } catch (error) {
      console.error('Ошибка получения отчёта по дате:', error);
    } finally {
      setLoading(false);
    }
  };

  let chartData = null;
  if (reportData) {
    console.log("Report Data received:", reportData);
    const keys = Object.keys(reportData);
    // Определяем, пришёл ли плоский объект (без группировки), где ключи — "1", "2", "3", "4"
    const isFlat = keys.every(key => ["1", "2", "3", "4"].includes(key));

    if (isFlat) {
      // Обработка для плоского ответа (без группировки)
      const labels = ["Общий"];
      chartData = {
        labels: labels,
        datasets: [
          {
            label: "Энергии потрачено, Вт",
            data: [reportData["1"] || 0],
            backgroundColor: 'rgba(255, 46, 102, 0.8)'
          },
          {
            label: "Энергии получено, Вт",
            data: [reportData["2"] || 0],
            backgroundColor: 'rgba(60, 255, 23, 0.88)'
          },
          {
            label: "Энергии взято из сети, Вт",
            data: [reportData["3"] || 0],
            backgroundColor: 'rgba(228, 23, 255, 0.88)'
          },
          {
            label: "Энергии отдано в сеть, Вт",
            data: [reportData["4"] || 0],
            backgroundColor: 'rgba(109, 238, 129, 0.88)'
          }
        ]
      };
    } else {
      // Обработка для сгруппированного ответа, где ключи — периоды (например, даты)
      const labels = Object.keys(reportData).sort();
      chartData = {
        labels: labels,
        datasets: [
          {
            label: "Энергии потрачено, Вт",
            data: labels.map(label => (reportData[label]["1"] || 0)),
            backgroundColor: 'rgba(255, 46, 102, 0.8)'
          },
          {
            label: "Энергии получено, Вт",
            data: labels.map(label => (reportData[label]["2"] || 0)),
            backgroundColor: 'rgba(60, 255, 23, 0.88)'
          },
          {
            label: "Энергии взято из сети, Вт",
            data: labels.map(label => (reportData[label]["3"] || 0)),
            backgroundColor: 'rgba(228, 23, 255, 0.88)'
          },
          {
            label: "Энергии отдано в сеть, Вт",
            data: labels.map(label => (reportData[label]["4"] || 0)),
            backgroundColor: 'rgba(109, 238, 129, 0.88)'
          }
        ]
      };
    }
  }

  return (
    <div className="container">
      <nav className="nav-bar">
        <Link to="/" className="nav-button">Главная</Link>
        <Link to="/report-by-date" className="nav-button">Отчёт по дате</Link>
      </nav>

      <h1 className="title">Отчёт по дате</h1>

      <form onSubmit={fetchReport} className="form">
        <label>
          Начальная дата:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </label>
        <label>
          Конечная дата:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </label>
        <label>
          Группировка:
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <option value="">Нет</option>
            <option value="day">По дням</option>
            <option value="month">По месяцам</option>
            <option value="year">По годам</option>
          </select>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Получить отчёт'}
        </button>
      </form>

      {reportData && (
        <div className="chart-container">
          <Bar data={chartData} />
        </div>
      )}
    </div>
  );
}

export default ReportByDatePage;
