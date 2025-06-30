import React, { useEffect, useState } from 'react';
import Subsidebar from './Subsidebar';


const Subnotification = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null)
  const [token, setToken] = useState(null)


  const getUserInfo = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const tokenn = localStorage.getItem('token');

  if (user && tokenn) {
    setUserId(user.id); // or user._id depending on structure
    setToken(tokenn);
  } else {
    console.warn("User or token not found in localStorage");
  }
};

  useEffect(()=>{getUserInfo();},[])

  useEffect(() => {
  const timer = setTimeout(() => {
    fetchNotifications();
    markReadNotification();
  }, 2000);

  return () => clearTimeout(timer);
}, [userId, token]);


  const fetchNotifications = () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    fetch(`https://tracking-backend-admin.vercel.app/v1/common/getNotification?userId=${userId}`, {
      method: 'GET',
      headers: myHeaders,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!userId || !token){
          console.log('userid not found ')
        }
        setNotifications(data.notificationData || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      });
  };
     const markReadNotification = () => {
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Bearer ${token}`);

const raw = JSON.stringify({
  "userId": userId
});
const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://tracking-backend-admin.vercel.app/v1/common/markNotificationAsRead", requestOptions)
  .then((response) => response.json())
  .catch((error) => console.error(error));
      }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900">
      {/* Sidebar toggle */}
      <div className="md:hidden p-4 bg-gray-800 shadow-md z-50 flex items-center justify-start gap-4">
        <button onClick={() => setSidebarOpen(true)} className="text-white">
          <i className="bi bi-list text-3xl"></i>
        </button>
        <h2 className="text-white text-xl font-semibold">Tracking App</h2>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 transform top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out bg-gray-800 shadow-lg ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Subsidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-y-auto text-white">
        <h2 className="text-2xl font-bold mb-4"> Notifications</h2>
        {loading ? (
          <p className="text-blue-400">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-400">No notifications found.</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((note, idx) => (
              <li key={idx} className="bg-gray-800 p-3 rounded shadow">
                <p className="font-semibold">{note.title || 'Untitled'}</p>
                <p className="text-sm text-gray-400">{note.message || 'No message'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Subnotification;
