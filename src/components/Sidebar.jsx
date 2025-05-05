import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink instead of Link
import './Sidebar.css';
import profilePhoto from '../assets/images/profilephoto.jpg';
import companyPhoto from '../assets/images/companylogo.jpg';


const Sidebar = () => {

  useEffect(() => {
    Get()
  }, [])

  const [myData, setMyData] = useState(null)
  const [token, setToken] = useState('')

  function Get() {
    const data = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    const ud = JSON.parse(data)
    setMyData(ud)
    setToken(token)
  }

  function Logout() {
    const token = localStorage.getItem('token'); // Make sure you get the token
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify({
      refreshToken: token,
      email: myData?.email
    });
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
  
    fetch("https://tracking-backend-admin.vercel.app/v1/admin/logoutAdmin", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // Remove token and redirect on successful logout
        localStorage.removeItem('token');
        window.location.href = "/"; // or wherever your login page is
      })
      .catch((error) => {
        console.error(error);
        alert("Logout failed.");
      });
  }
  
  return (
    <div className="sidebar">
      <div className="logo">
        <img className="logo" src={companyPhoto} alt="Profile" />
      </div>

      {/* User Profile Section */}
      <div className="profile-section">
        <img className="profile-img" src={profilePhoto} alt="Profile" />
        <div className="profile-info">
          <div className="profile-name">{myData?.fullName}</div>
          <div className="profile-role">Admin</div>
        </div>
      </div>

      <ul className="nav-list">
        <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-tachometer"></i> Dashboard</NavLink></li>
        <li><NavLink to="/users" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-user"></i> User</NavLink></li>
        <li><NavLink to="/companies" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-building"></i> Company</NavLink></li>
        <li><NavLink to="/notifications" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-bell"></i> Notifications</NavLink></li>
        <li><NavLink to="/about" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-info-circle"></i> About Us</NavLink></li>
      </ul>

      {/* Logout Button */}
      <div className="logout-section">
        <NavLink to="/" >
        <button className="logout-button" onClick={()=>Logout()}  >
          <i className="fa fa-sign-out"></i> Logout
          </button>
        </NavLink>
        {/* <button className="logout-button" onClick={()=>{
          Logout()
        }}>
          <i className="fa fa-sign-out"></i> Logout
        </button> */}
      </div>
    </div>
  );
};

export default Sidebar;
