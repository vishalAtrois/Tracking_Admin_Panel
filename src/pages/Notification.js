import React from 'react';
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
  return (
    <div className="flex h-screen overflow-auto  bg-gray-900">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-900 ml-64">
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
