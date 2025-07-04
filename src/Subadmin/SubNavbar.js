import React, { useEffect, useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SubNavbar = () => {
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [myData, setMyData] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('user');
    const storedToken = localStorage.getItem('rtoken');
    const ud = JSON.parse(data);
    setMyData(ud);
    setToken(storedToken);
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
        if (result.success === true) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('rtoken');
          localStorage.removeItem('permissions');
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
    <nav className="fixed top-0 left-0 right-0 ml-60 z-30 bg-black shadow-md px-4 py-3 flex items-center justify-between">
      {/* Title */}
      <h1 className="text-lg font-bold text-white">Tracking App - Subadmin Profile</h1>

      {/* Settings Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowSettingsDropdown(prev => !prev)}
          className="flex items-center gap-2 text-white hover:text-white"
        >
          <FaCog className="text-xl" />
          <span className="hidden sm:inline">Settings</span>
          <i className={`fa ${showSettingsDropdown ? "fa-chevron-up" : "fa-chevron-down"} text-sm`} />
        </button>

        {showSettingsDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-black text-white rounded-lg shadow-lg z-50">
            <ul className="py-1">
              <li
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-t"
                onClick={() => {
                  setShowSettingsDropdown(false);
                  navigate('/SubProfile');
                }}
              >
                Profile
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-b"
                onClick={() => {
                  setShowSettingsDropdown(false);
                  setShowLogoutModal(true);
                }}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-full text-center shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
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
    </nav>
  );
};

export default SubNavbar;
