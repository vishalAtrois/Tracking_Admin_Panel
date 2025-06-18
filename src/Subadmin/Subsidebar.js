import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Subsidebar.css';
import { FaCog } from 'react-icons/fa';
import profilePhoto from '../assets/images/profilephoto.jpg';

const Subsidebar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [myData, setMyData] = useState(null);
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const data = localStorage.getItem('user');
    const storedToken = localStorage.getItem('rtoken');
    const ud = JSON.parse(data);
    setMyData(ud);
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        if (result.success === true) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('rtoken');
          navigate('/');
        } else {
          console.error(result);
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
        <img className="profile-img" src={profilePhoto} alt="Profile" />
        <div className="profile-info">
          <div className="profile-name">{myData?.fullName || "Sub Admin"}</div>
          <div className="profile-role">Sub Admin</div>
        </div>
      </div>

      {/* Nav Links */}
      <ul className="nav-list">
        <li><NavLink to="/Subdashboard" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-tachometer"></i> Dashboard</NavLink></li>
        <li><NavLink to="/Suballtasks" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-tasks"></i> All Tasks</NavLink></li>
        <li><NavLink to="/Subreports" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-clipboard"></i> Daily Reports</NavLink></li>
        <li><NavLink to="/Subcheckin" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-sticky-note"></i> Work Hours</NavLink></li>
        <li><NavLink to="/Subemployees" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-user"></i> Employees</NavLink></li>
        <li><NavLink to="/Subnotification" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-bell"></i> Notifications</NavLink></li>
        <li><NavLink to="/VoiceTasks" className={({ isActive }) => isActive ? "active-link" : ""}><i className="bi bi-list-task"></i> Voice Tasks</NavLink></li>
        <li><NavLink to="/Subprefrences" className={({ isActive }) => isActive ? "active-link" : ""}><i className="fa fa-cogs text-lg"></i> Prefrences </NavLink></li>
        {/* Settings Dropdown */}
        <li className="relative" ref={dropdownRef}>
          <div
            onClick={() => setShowDropdown(prev => !prev)}
            className="flex items-center w-full px-1  text-white hover:bg-gray-700 cursor-pointer  text-xl"
          >
            <FaCog className="mr-2" />
            <span>Settings</span>
          </div>

          {showDropdown && (
            <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-md shadow-lg z-40">
              <ul className="py-1 text-gray-700">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/SubProfile');
                  }}
                >
                  Profile
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setShowDropdown(false);
                    setShowLogoutModal(true);
                  }}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </li>
      </ul>

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

export default Subsidebar;
