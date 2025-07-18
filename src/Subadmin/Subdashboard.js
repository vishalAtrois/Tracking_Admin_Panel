import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Tooltip, ResponsiveContainer,  Cell, Pie, PieChart } from 'recharts';
import Subsidebar from './Subsidebar';
 
const Subdashboard = () => {
 
 const [loading,setLoading]=useState(true) 
  const [userCount, setUserCount] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
    const [totalTasks, setTotalTasks] = useState(0)
    const [taskChartData, setTaskChartData] = useState([]);
     const [userId, setUserId] = useState(null)
      const [tokennn, setTokennn] =useState(null)
      const [readNotification, setReadNotification] = useState(null)
      const [totalNotification, setTotalNotification] = useState(null)

  
  const getUserInfo = () => {
   const user = JSON.parse(localStorage.getItem('user'));
   const tokenn = localStorage.getItem('token');
 
   if (user && tokenn) {
     setUserId(user.id); // or user._id depending on structure
     setTokennn(tokenn);
   } else {
     console.warn("User or token not found in localStorage");
   }
 };
 useEffect(()=>{getUserInfo();},[])
     useEffect(()=>{
   const timer = setTimeout(()=>{fetchNotifications()},2000)
   return () => clearTimeout(timer) 
     },[userId, tokennn])
   
     const fetchNotifications = () => {
       const myHeaders = new Headers();
       myHeaders.append('Authorization', `Bearer ${tokennn}`);
   
       fetch(`https://tracking-backend-admin.vercel.app/v1/common/getNotification?userId=${userId}`, {
         method: 'GET',
         headers: myHeaders,
       })
         .then((res) => res.json())
         .then((data) => {
           if (!userId || !tokennn){
             console.log('userid not found ')
           }
           const unreadCount = data.notificationData.filter(item => item.read === false).length;
 setReadNotification(unreadCount)
 const notificationCount = data.notificationData.length
setTotalNotification(notificationCount)
setLoading(false)
         })
         .catch((error) => {
           console.error('Error fetching notifications:', error);
            
         });
     };
 

function fetchTask() {
  const token = localStorage.getItem('token');
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: 'follow',
  };

  fetch('https://tracking-backend-admin.vercel.app/v1/common/getTaskStatusStats', requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.success === true && Array.isArray(result.stats)) {
        const filteredStats = result.stats.filter(stat =>
          stat.status !== 'active' && stat.status !== 'deleted'
        );
        const formatted = filteredStats.map(stat => ({
          name: stat.status.charAt(0).toUpperCase() + stat.status.slice(1),
          value: stat.count
        }));
        setTaskChartData(formatted);
      }
    })
    .catch((error) => {
      console.log("error while getting the task graph data ", error);
    });
}

const fetchSubadminPreference = async () => {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
  const storedUser = JSON.parse(localStorage.getItem("user"));
      try {
        const response = await fetch(`https://tracking-backend-admin.vercel.app/v1/subAdmin/getMyPermissions?userId=${storedUser.id}`, requestOptions);
        const result = await response.json();
        if (result.success) {
        localStorage.setItem("permissions", JSON.stringify(result.permissions.permissions))
        }
      } catch (error) {
        console.log('check subadmin api error ', error);
      }
    };


useEffect(()=>{fetchTask()
  fetchSubadminPreference()
},[])

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
          setUserCount(result.UserList.totalResults)
          setLoading(false)
          
        }
      })
      .catch((error) => console.error(error));
  }


  function fetchTaskCount (){

    const token = localStorage.getItem('token')
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch("https://tracking-backend-admin.vercel.app/v1/subAdmin/taskCount", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if(result.success === true){
          setTotalTasks(result.totalTasks)
          
        }
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    fetchUsers();
    fetchTaskCount()
  }, []);

  return (
    
    <div className="flex flex-col md:flex-row h-screen w-screen bg-custom-bg ">
    {/* Mobile Sidebar Toggle */}
    <div className="md:hidden p-4 bg-custom-bg shadow-md z-50 flex items-center justify-start gap-4 sticky top-0.5">
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
      className={`fixed md:relative z-50 transform top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out bg-custom-bg  shadow-lg ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
     <Subsidebar />
    </div>
    {/* Main Content */}
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
      <div className="bg-custom-bg p-4 sm:p-6 rounded-xl shadow-lg min-h-screen ">
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
            className="bg-gradient-to-br from-red-700 to-red-900 hover:from-red-800 hover:to-red-950 transition-colors duration-300 p-6 rounded-xl text-white shadow-lg cursor-pointer"
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
            onClick={() => navigate('/VoiceTasks')}
            className="bg-gradient-to-br from-yellow-400 to-yellow-700 hover:from-yellow-500 hover:to-yellow-750 transition-colors duration-300 p-6 rounded-xl text-white shadow-lg cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Total tasks</h3>
                <p className="text-3xl sm:text-4xl font-bold">
                  {loading ? '...' : totalTasks}
                </p>
              </div>
              <i className="fa fa-building text-4xl sm:text-5xl opacity-80" />
            </div>
          </div>

            <div
            onClick={() => navigate('/Subnotification')}
            className="bg-gradient-to-br from-gray-400 to-gray-700 hover:from-gray-500 hover:to-gray-750 transition-colors duration-300 p-6 rounded-xl text-white shadow-lg cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Notifications
                  {readNotification > 0 && (
      <span className="ml-1 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
        {readNotification}
      </span>
    )}
                </h3>
                <p className="text-3xl sm:text-4xl font-bold">
                  {loading ? '...' : totalNotification}
                </p>
              </div>
              <i className="fa fa-bell text-4xl sm:text-5xl opacity-80" />
            </div>
          </div>
        </div>

        {/* Graph */}
<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
  <div className="bg-custom-bg text-white p-4 sm:p-6 rounded-xl border border-gray-700 shadow-md">
    <h3 className="text-2xl sm:text-3xl font-semibold mb-4 text-center sm:text-left">
      Task Status Overview
    </h3>
    <ResponsiveContainer width="100%" height={250}>
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
              Accepted: '#10b981',
              Active: '#22c55e',
              Completed: '#3b82f6',
              Deleted: '#ef4444',
              Progress: '#f97316',
              Seen: '#a855f7',
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

    {/* ✅ Custom Legend */}
    <div className="flex flex-wrap justify-center mt-4 gap-4">
      {taskChartData.map(({ name }, index) => {
        const COLORS = {
          Accepted: '#10b981',
          Active: '#22c55e',
          Completed: '#3b82f6',
          Deleted: '#ef4444',
          Progress: '#f97316',
          Seen: '#a855f7',
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