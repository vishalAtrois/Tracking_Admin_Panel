import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Tooltip, ResponsiveContainer,  Cell, Pie, PieChart } from 'recharts';
import Subsidebar from './Subsidebar';
 
 

const Subdashboard = () => {
 
 const [loading,setLoading]=useState(true) 
  const [userCount, setUserCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [taskChartData, setTaskChartData] = useState([]);
    
  
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

  function fetchUsers (){

    const token = localStorage.getItem('token')
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch("https://tracking-backend-admin.vercel.app/v1/subAdmin/fetchUserList?page=1&limit=10&sortBy=created:desc", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if(result.success === true){
          console.log(result.UserList);
          setUserCount(result.UserList.totalResults)
          setLoading(false)
          
        }
      })
      .catch((error) => console.error(error));
  }

function fetchCompany() {
  const token = localStorage.getItem('token');
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  fetch("https://mocki.io/v1/c9f560f0-7037-4e50-968b-4cccc8b56b2f", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log('tasks ', result);

      // Count active, completed and pending
      const tasks = result;
      let active = 0;
      let completed = 0;
      let pending = 0;

      tasks.forEach(task => {
        if (task.status === 'active') active++;
        else if (task.status === 'completed') completed++;
        else if (task.status === 'pending') pending++;
      });

      setTaskChartData([
        { name: 'Active', value: active },
        { name: 'Completed', value: completed },
        { name: 'Pending', value: pending },  // Added pending here
      ]);

      setCompanyCount(tasks.length);
      setLoading(false);
    })
    .catch((error) => console.error(error));
}


  useEffect(() => {
    fetchUsers();
    fetchCompany()
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900">
    {/* Mobile Sidebar Toggle */}
    <div className="md:hidden p-4 bg-gray-800 shadow-md z-50 flex items-center justify-start gap-4 sticky top-0.5">
  <button onClick={() => setSidebarOpen(true)} className="text-white focus:outline-none">
    <i className="bi bi-list text-3xl"></i>
  </button>
  <h2 className="text-white text-xl font-semibold">Tracking App</h2>
</div>
    {/* Overlay for Mobile Sidebar */}
    {sidebarOpen && (
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}
    {/* Sidebar */}
    <div
      className={`fixed md:relative z-50 transform top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out bg-gray-800 shadow-lg ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
     <Subsidebar />
    </div>
    {/* Main Content */}
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
      <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg min-h-screen ">
      <div className="flex justify-between items-center mb-6 -mt-2 sm:-mt-4">
  <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-wide">
    Dashboard
  </h2>
</div>
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Users Card */}
          <div
            onClick={() => navigate('/Subemployees')}
            className="bg-gradient-to-br from-purple-700 to-purple-900 hover:from-purple-800 hover:to-purple-950 transition-colors duration-300 p-6 rounded-xl text-white shadow-lg cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Total Employees</h3>
                <p className="text-3xl sm:text-4xl font-bold">
                  {loading ? '...' : userCount}
                </p>
              </div>
              <i className="fa fa-user text-4xl sm:text-5xl opacity-80" />
            </div>
          </div>
          {/* Companies Card */}
          <div
            onClick={() => navigate('/Suballtasks')}
            className="bg-gradient-to-br from-indigo-600 to-indigo-900 hover:from-indigo-700 hover:to-indigo-950 transition-colors duration-300 p-6 rounded-xl text-white shadow-lg cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Total tasks</h3>
                <p className="text-3xl sm:text-4xl font-bold">
                  {loading ? '...' : companyCount}
                </p>
              </div>
              <i className="fa fa-building text-4xl sm:text-5xl opacity-80" />
            </div>
          </div>
        </div>

        {/* Graph */}
<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="bg-gray-800 text-white p-4 sm:p-6 rounded-xl border border-gray-700 shadow-md">
    <h3 className="text-2xl sm:text-3xl font-semibold mb-4 text-center sm:text-left">
      Task Status Overview
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={taskChartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={50}
          fill="#8884d8"
          paddingAngle={5}
          labelLine={false}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {taskChartData.map((entry, index) => {
            const COLORS = {
              Active: '#22c55e',
              Completed: '#3b82f6',
              Pending: '#f59e0b',
            };
            return (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
            );
          })}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            borderColor: '#374151',
            borderRadius: '8px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>

    {/* Custom legend below the chart */}
    <div className="flex justify-center mt-4 space-x-6">
      {taskChartData.map(({ name }, index) => {
        const COLORS = {
          Active: '#22c55e',
          Completed: '#3b82f6',
          Pending: '#f59e0b',
        };
        return (
          <div key={index} className="flex items-center space-x-2 text-white text-sm font-medium">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: COLORS[name] || '#8884d8' }}
            />
            <span>{name}</span>
          </div>
        );
      })}
    </div>
  </div>
</div>
      </div>
    </div>
  </div>
  
  );
};

export default Subdashboard;