import React, { useState, useEffect } from 'react';
import { studentsAPI, roomsAPI, complaintsAPI, maintenanceAPI, attendanceAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    pendingComplaints: 0,
    pendingMaintenance: 0,
    todayAttendance: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [studentsRes, roomsRes, complaintsRes, maintenanceRes, attendanceRes] = await Promise.all([
        studentsAPI.getAll(),
        roomsAPI.getAll(),
        complaintsAPI.getAll(),
        maintenanceAPI.getAll(),
        attendanceAPI.getByDate(today),
      ]);

      const students = studentsRes.data;
      const rooms = roomsRes.data;
      const complaints = complaintsRes.data;
      const maintenance = maintenanceRes.data;
      const attendance = attendanceRes.data;

      setStats({
        totalStudents: students.length,
        totalRooms: rooms.length,
        occupiedRooms: rooms.filter(r => r.status === 'Occupied').length,
        pendingComplaints: complaints.filter(c => c.status === 'Pending').length,
        pendingMaintenance: maintenance.filter(m => m.status === 'Pending').length,
        todayAttendance: attendance.length,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Students</h3>
          <div className="stat-value">{stats.totalStudents}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Rooms</h3>
          <div className="stat-value">{stats.totalRooms}</div>
        </div>
        
        <div className="stat-card">
          <h3>Occupied Rooms</h3>
          <div className="stat-value">{stats.occupiedRooms}</div>
        </div>
        
        <div className="stat-card">
          <h3>Pending Complaints</h3>
          <div className="stat-value">{stats.pendingComplaints}</div>
        </div>
        
        <div className="stat-card">
          <h3>Pending Maintenance</h3>
          <div className="stat-value">{stats.pendingMaintenance}</div>
        </div>
        
        <div className="stat-card">
          <h3>Today's Attendance</h3>
          <div className="stat-value">{stats.todayAttendance}</div>
        </div>
      </div>

      <div className="dashboard-info">
        <div className="info-card">
          <h2>Welcome to Hostel Administration System</h2>
          <p>Manage your hostel operations efficiently with this comprehensive system.</p>
          <ul>
            <li>Track student information and room allocations</li>
            <li>Monitor attendance and entry/exit logs</li>
            <li>Handle complaints and maintenance requests</li>
            <li>Record disciplinary actions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


