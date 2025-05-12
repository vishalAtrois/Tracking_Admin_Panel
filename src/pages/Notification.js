import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

// Dummy data for Notifications
const notifications = [
  { id: 1, message: "Your account has been successfully updated.", date: "2025-04-20" },
  { id: 2, message: "New messages from your team.", date: "2025-04-19" },
  { id: 3, message: "A new version of your app is available.", date: "2025-04-18" },
  { id: 4, message: "Your password was changed successfully.", date: "2025-04-17" },
  { id: 5, message: "You have a new notification regarding your recent activity.", date: "2025-04-16" },
];

const Notifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900">
      <div className="md:hidden p-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-white focus:outline-none"
        >
          <i className="bi bi-list text-3xl"></i>
        </button>
      </div>

      {/* Overlay */}
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
        <Sidebar />
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {/* The rest of your component (search bar, table, pagination, modals, etc.) remains exactly the same */}

        {/* Insert your previous design code from this point onward */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h2>

      <ul className="space-y-4">
        {notifications.map((notification) => (
          <li key={notification.id} className="p-4 bg-white rounded shadow-md flex justify-between">
            <div>
              <p className="text-gray-700">{notification.message}</p>
              <small className="text-gray-500">{notification.date}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>

      </div>
    </div>
  );
};

export default Notifications;
