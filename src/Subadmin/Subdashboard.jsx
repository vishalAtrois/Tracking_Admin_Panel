import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";


const Subdashboard = () => {
    const [todayTasks, setTodayTasks] = useState([]);
    const [employeeCount, setEmployeeCount] = useState(0);
    const [reportCount, setReportCount] = useState(0);
    const [taskStats, setTaskStats] = useState([]);
  
    useEffect(() => {
      const token = localStorage.getItem("token");
  
      // Fetch all data in parallel
      Promise.all([
        fetch("/api/subadmin/today-tasks", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/subadmin/employee-count", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/subadmin/report-count", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/subadmin/task-stats", { headers: { Authorization: `Bearer ${token}` } }),
      ])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(([tasks, empCount, repCount, stats]) => {
          setTodayTasks(tasks);
          setEmployeeCount(empCount.count);
          setReportCount(repCount.count);
          setTaskStats(stats);
        })
        .catch(err => console.error("Error loading dashboard:", err));
    }, []);
  




  return (
    <div className="p-6">
    <h1 className="text-3xl font-bold mb-6">Sub Admin Dashboard</h1>

    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white shadow-md rounded-lg p-4 text-center">
        <h2 className="text-lg font-semibold">Total Employees</h2>
        <p className="text-2xl font-bold">{employeeCount}</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 text-center">
        <h2 className="text-lg font-semibold">Total Reports</h2>
        <p className="text-2xl font-bold">{reportCount}</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 text-center">
        <h2 className="text-lg font-semibold">Today's Tasks</h2>
        <p className="text-2xl font-bold">{todayTasks.length}</p>
      </div>
    </div>

    {/* Task Graph */}
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Task Status Graph</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={taskStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Today's Task List */}
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
      <ul className="space-y-2">
        {todayTasks.map((task, index) => (
          <li key={index} className="border p-2 rounded">
            <strong>{task.employeeName}</strong>: {task.description}
          </li>
        ))}
      </ul>
    </div>
  </div>
  )
}

export default Subdashboard