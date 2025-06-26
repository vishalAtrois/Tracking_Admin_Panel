import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';  
import './Sidebar.css';
import profilePhoto from '../assets/images/profilephoto.jpg';
 

const Sidebar = () => {

const [showLogoutModal, setShowLogoutModal] = useState(false);
const navigate=useNavigate()
 

  useEffect(() => {
    Get()
  }, [])

  const [myData, setMyData] = useState(null)
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
  
    fetch("https://tracking-backend-admin.vercel.app/v1/admin/logoutAdmin", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if(result.success == true){
          localStorage.removeItem('Admintoken');
          localStorage.removeItem('user')
          localStorage.removeItem('rtoken')
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
    {/* <div className="profile-section"> */}
      {/* <img className="profile-img" src={profilePhoto} alt="Profile" /> */}
      <div className="profile-info">
        <div className="profile-name">{myData?.fullName}</div>
        <div className="profile-role">Admin</div>
      </div>
    {/* </div> */}

    <ul className="nav-list">
      <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-tachometer"></i> Dashboard</NavLink></li>
      <li><NavLink to="/users" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-user"></i> User</NavLink></li>
      <li><NavLink to="/companies" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-building"></i> Company</NavLink></li>
      <li><NavLink to="/AdminNotification" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-bell"></i>send Notifications</NavLink></li>
      <li><NavLink to="/report" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-clipboard"></i>Daily Reports</NavLink></li>
      <li><NavLink to="/Logs" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-sticky-note"></i> Work Hours</NavLink></li>
      <li><NavLink to="/notifications" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-bell"></i> Notifications</NavLink></li>
            <li><NavLink to="/Prefrences" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-cogs text-lg"></i> Preferences </NavLink></li>
      {/* <li><NavLink to="/about" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-info-circle"></i> About Us</NavLink></li> */}
    </ul>

   {/* Logout Button */}
   <div className="logout-section">
        <button
          className="logout-button"
         onClick={() => {
                    setShowLogoutModal(true);
                  }}
        >
          <i className="fa fa-sign-out"></i> Logout
        </button>
      </div>

      
   
      {/* Logout Modal */}
   {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-start justify-center z-50 pt-20">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 transition text-white"
              >
                Cancel
              </button>
              <button
                onClick={Logout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
  </div>
  );
};

export default Sidebar;
