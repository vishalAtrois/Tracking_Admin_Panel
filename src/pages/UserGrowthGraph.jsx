


import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const userData = [
  { month: 'Jan', users: 30 },
  { month: 'Feb', users: 45 },
  { month: 'Mar', users: 60 },
  { month: 'Apr', users: 80 },
  { month: 'May', users: 70 },
  { month: 'Jun', users: 90 },
  { month: 'Jul', users: 120 },
  { month: 'Aug', users: 110 },
  { month: 'Sep', users: 130 },
  { month: 'Oct', users: 150 },
  { month: 'Nov', users: 140 },
  { month: 'Dec', users: 160 },
];

const UserGrowthGraph = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg mt-6 text-white">
      <h3 className="text-2xl font-bold mb-4">User Registrations (Last 12 Months)</h3>
      <ResponsiveContainer width="100%" height={300}> {/* Ensure it takes full width of the parent */}
        <LineChart data={userData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
          <XAxis dataKey="month" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="#f59e0b" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGrowthGraph;
