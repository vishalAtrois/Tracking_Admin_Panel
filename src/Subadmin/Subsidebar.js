import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';  
import './Subsidebar.css';
import profilePhoto from '../assets/images/profilephoto.jpg';
 

const Subsidebar = () => {
const navigate=useNavigate()
 

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

  function Logout() {
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
  
    fetch("https://tracking-backend-admin.vercel.app/v1/subAdmin/logoutSubAdmin", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if(result.success == true){
          alert("you are logged out ")
          localStorage.removeItem('token');
          localStorage.removeItem('user')
          localStorage.removeItem('ruser')
          navigate('/'); 
        }else{
          console.error(result)
        }
      
      })
      .catch((error) => {
        console.error(error);
        alert("Logout failed.");
      });
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
       <li><NavLink to="/Settings" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa	fa-cog"></i> Settings</NavLink></li>
    </ul>

   {/* Logout Button */}
   <div className="logout-section">
        <button
          className="logout-button"
          onClick={() =>  Logout()}
        >
          <i className="fa fa-sign-out"></i> Logout
        </button>
      </div>

      
   
      {/* Logout Modal */}
  
  </div>
  );
};

export default Subsidebar;
