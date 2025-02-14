// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import ReportByDatePage from './ReportByDatePage';

function App() {
  return (
    <Router>
      <div>
        <nav style={{ margin: '20px' }}>
          <Link to="/" style={{ marginRight: '15px' }}>Главная</Link>
          <Link to="/report-by-date">Отчёт по дате</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report-by-date" element={<ReportByDatePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
