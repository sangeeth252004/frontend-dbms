import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Rooms from './pages/Rooms';
import Allocations from './pages/Allocations';
import Attendance from './pages/Attendance';
import Complaints from './pages/Complaints';
import Disciplinary from './pages/Disciplinary';
import Maintenance from './pages/Maintenance';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/allocations" element={<Allocations />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/disciplinary" element={<Disciplinary />} />
            <Route path="/maintenance" element={<Maintenance />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;


