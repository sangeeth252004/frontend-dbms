import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <h2>🏠 Hostel Admin</h2>
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/" className={isActive('/')}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/students" className={isActive('/students')}>
              Students
            </Link>
          </li>
          <li>
            <Link to="/rooms" className={isActive('/rooms')}>
              Rooms
            </Link>
          </li>
          <li>
            <Link to="/allocations" className={isActive('/allocations')}>
              Allocations
            </Link>
          </li>
          <li>
            <Link to="/attendance" className={isActive('/attendance')}>
              Attendance
            </Link>
          </li>
          <li>
            <Link to="/complaints" className={isActive('/complaints')}>
              Complaints
            </Link>
          </li>
          <li>
            <Link to="/disciplinary" className={isActive('/disciplinary')}>
              Disciplinary
            </Link>
          </li>
          <li>
            <Link to="/maintenance" className={isActive('/maintenance')}>
              Maintenance
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;


