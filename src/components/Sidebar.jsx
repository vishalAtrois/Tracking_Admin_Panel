import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink instead of Link
import './Sidebar.css';
import profilePhoto from '../assets/images/profilephoto.jpg';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src="/logo192.png" alt="Logo" width="80" />
      </div>

      {/* User Profile Section */}
      <div className="profile-section">
        <img className="profile-img" src={profilePhoto} alt="Profile" />
        <div className="profile-info">
          <div className="profile-name">Mansh Walia</div>
          <div className="profile-role">Admin</div>
        </div>
      </div>

      <ul className="nav-list">
        <li><NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-tachometer"></i> Dashboard</NavLink></li>
        <li><NavLink to="/users" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-user"></i> User</NavLink></li>
        <li><NavLink to="/companies" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-building"></i> Company</NavLink></li>
        <li><NavLink to="/notifications" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-bell"></i> Notifications</NavLink></li>
        <li><NavLink to="/about" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-info-circle"></i> About Us</NavLink></li>
      </ul>

      {/* Logout Button */}
      <div className="logout-section">
        <button className="logout-button">
          <i className="fa fa-sign-out"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
