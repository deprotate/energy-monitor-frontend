// PredictReport.js
import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Link } from 'react-router-dom';
import './PredictReport.css';
import logo from './logo.png';

// Импорт для карты
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './leafletFix';


// Настройка стандартных иконок для маркера (если требуется)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Компонент выбора координат на карте
function MapPicker({ longitude, latitude, setLongitude, setLatitude }) {
	const defaultPosition = [latitude || 55.75, longitude || 37.62]; // по умолчанию Москва
	const [position, setPosition] = useState(defaultPosition);

	useMapEvents({
		click(e) {
			const { lat, lng } = e.latlng;
			setPosition([lat, lng]);
			setLatitude(lat);
			setLongitude(lng);
		},
	});

	return <Marker position={position} />;
}

function MapSelector({ longitude, latitude, setLongitude, setLatitude }) {
	return (
		<MapContainer center={[latitude || 55.75, longitude || 37.62]} zoom={10} scrollWheelZoom={false} className="map-container">
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<MapPicker longitude={longitude} latitude={latitude} setLongitude={setLongitude} setLatitude={setLatitude} />

		</MapContainer>
	);
}

function PredictReport() {
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [groupBy, setGroupBy] = useState('');
	const [longitude, setLongitude] = useState('');
	const [latitude, setLatitude] = useState('');
	const [reportData, setReportData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchReport = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setReportData(null);
		try {
			// Формируем параметры запроса, не включая group_by, если он пустой
			const params = {
				start_date: startDate,
				end_date: endDate,
				longitude: longitude,
				latitude: latitude,
			};
			if (groupBy) {
				params.group_by = groupBy;
			}
			const response = await axios.get(
				'https://energy-monitor-fastapi-production.up.railway.app/predict_report/',
				{ params }
			);
			setReportData(response.data);
		} catch (err) {
			console.error('Ошибка получения прогноза:', err);
			setError('Не удалось получить данные, проверьте корректность введённых данных и при сохранении проблемы обращайтесь в поддержку - support.vfs@gmail.com');
		} finally {
			setLoading(false);
		}
	};

	let chartData = null;
	if (reportData) {
		const keys = Object.keys(reportData);
		const isFlat = keys.every((key) => ["1", "2", "3", "4"].includes(key));
		if (isFlat) {
			const labels = ['Общий прогноз'];
			chartData = {
				labels: labels,
				datasets: [
					{
						label: 'Потреблено, Вт',
						data: [reportData["1"] || 0],
						backgroundColor: 'rgba(180, 196, 199, 0.8)',
					},
					{
						label: 'Произведено, Вт',
						data: [reportData["2"] || 0],
						backgroundColor: 'rgba(43, 238, 124, 0.8)',
					},
					{
						label: 'Из сети, Вт',
						data: [reportData["3"] || 0],
						backgroundColor: 'rgba(151, 159, 160, 0.8)',
					},
					{
						label: 'В сеть, Вт',
						data: [reportData["4"] || 0],
						backgroundColor: 'rgba(39, 156, 88, 0.8)',
					},
				],
			};
		} else {
			const labels = Object.keys(reportData).sort();
			chartData = {
				labels: labels,
				datasets: [
					{
						label: 'Потреблено, Вт',
						data: labels.map((label) => reportData[label]["1"] || 0),
						backgroundColor: 'rgba(180, 196, 199, 0.8)',
					},
					{
						label: 'Произведено, Вт',
						data: labels.map((label) => reportData[label]["2"] || 0),
						backgroundColor: 'rgba(43, 238, 124, 0.8)',
					},
					{
						label: 'Из сети, Вт',
						data: labels.map((label) => reportData[label]["3"] || 0),
						backgroundColor: 'rgba(151, 159, 160, 0.8)',
					},
					{
						label: 'В сеть, Вт',
						data: labels.map((label) => reportData[label]["4"] || 0),
						backgroundColor: 'rgba(39, 156, 88, 0.8)',
					},
				],
			};
		}
	}

	return (
		<div className="container">
			<header className="header">

				<nav className="nav-bar">
					<img src={logo} alt="Energy Monitor Logo" className="logo" />
					<Link to="/" className="nav-button">Главная</Link>
					<Link to="/report-by-date" className="nav-button">Отчёт по дате</Link>
					<Link to="/predict-report" className="nav-button active">Прогноз по дате</Link>
				</nav>
			</header>

			<main>
				<h1 className="title">Прогноз энергопотребления</h1>
				<form onSubmit={fetchReport} className="form">
					<label>
						Начальная дата:
						<input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							required
						/>
					</label>
					<label>
						Конечная дата:
						<input
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							required
						/>
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
					<label>
						Долгота:
						<input
							type="number"
							value={longitude}
							onChange={(e) => setLongitude(e.target.value)}
							placeholder="Формат: десятичное число, например, 37.62"
							required
						/>
					</label>
					<label>
						Широта:
						<input
							type="number"
							value={latitude}
							onChange={(e) => setLatitude(e.target.value)}
							placeholder="Формат: десятичное число, например, 55.75"
							required
						/>
					</label>
					<div className="map-wrapper">
						<p className="map-hint">Либо выберите точку на карте</p>
						<MapSelector
							longitude={parseFloat(longitude)}
							latitude={parseFloat(latitude)}
							setLongitude={setLongitude}
							setLatitude={setLatitude}
						/>
					</div>
					<button type="submit" disabled={loading}>
						{loading ? 'Загрузка...' : 'Получить прогноз'}
					</button>
				</form>

				{error ? (
					<div className="error-message">{error}</div>
				) : (
					reportData && (
						<div className="chart-container">
							<Bar data={chartData} />
						</div>
					)
				)}
			</main>

			<footer className="footer">
				<p>© {new Date().getFullYear()} ВФС. Все права защищены.</p>
			</footer>
		</div>
	);
}

export default PredictReport;














2)Ну лучше опираться на то что есть, но есть моменты которые мне кажется стоит упомянуть по любому:  Рассказать про её функционал, как и остальных, Работа с картой и обработка ошибок
