import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';  
import './Subsidebar.css';
import profilePhoto from '../assets/images/profilephoto.jpg';
 

const Subsidebar = () => {

 

  useEffect(() => {
    Get()
  }, [])

  const [myData, setMyData] =  useState(null)
  const [token, setToken] = useState('')

  function Get() {
    const data = localStorage.getItem('user')
    const token = localStorage.getItem('rtoken')
    const ud = JSON.parse(data)
    setMyData(ud)
    setToken(token)
  }

  
  return (
    <div className="sidebar">
    

    {/* User Profile Section */}
    <div className="profile-section">
      {/* <img className="profile-img" src={profilePhoto} alt="Profile" /> */}
      <div className="profile-info">
        <div className="profile-name">{myData?.fullName}</div>
        <div className="profile-role">Admin</div>
      </div>
    </div>

    <ul className="nav-list">
      <li><NavLink to="/Subdashboard" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-tachometer"></i> Dashboard</NavLink></li>
      <li><NavLink to="/Suballtasks" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-tasks"></i> All Tasks</NavLink></li>
      <li><NavLink to="/Subemployees" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-user"></i>Employees</NavLink></li>
      <li><NavLink to="/Subreports" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-clipboard"></i> Reports</NavLink></li>
      <li><NavLink to="/Subcheckin" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-sticky-note"></i> Logs</NavLink></li>
    </ul>

   {/* Logout Button */}
    

      
   
      {/* Logout Modal */}
  
  </div>
  );
};

export default Subsidebar;
