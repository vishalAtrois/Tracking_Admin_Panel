import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserGrowthGraph from './UserGrowthGraph';
 

const Dashboard = () => {
 
 const [loading,setLoading]=useState(true) 
  const [userCount, setUserCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  function fetchUsers (){

    const token = localStorage.getItem('token')
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch("https://tracking-backend-admin.vercel.app/v1/admin/fetchUserList?page=1&limit=10&sortBy=createdAt:desc", requestOptions)
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

  function fetchCompany(){
    const token = localStorage.getItem('token')
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers:myHeaders,
      redirect: "follow"
    };
    
    fetch("https://tracking-backend-admin.vercel.app/v1/admin/fetchCompanyList?page=1&limit=10&sortBy=createdAt:desc", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if(result.success === true){
          console.log(result);
          setCompanyCount(result.UserList.totalResults)
          setLoading(false)
        }
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    fetchUsers();
    fetchCompany()
  }, []);

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

    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
  <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg min-h-screen">
    <h2 className="text-white text-2xl sm:text-3xl mb-6 -mt-2 sm:-mt-4">Dashboard</h2>

    {/* User and Company Cards */}
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
      {/* User Section */}
      <div
        className="bg-gray-800 text-white p-4 sm:p-6 rounded-lg flex-1 border border-gray-500 shadow-md cursor-pointer hover:bg-gray-700 transition"
        onClick={() => navigate('/users')}
      >
        <h3 className="text-2xl sm:text-3xl font-semibold mb-4">Users</h3>
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-blue-600 font-medium">Loading User...</p>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl sm:text-2xl font-bold">{userCount}</span>
            <i className="fa fa-user text-3xl sm:text-4xl"></i>
          </div>
        )}
      </div>

      {/* Company Section */}
      <div
        className="bg-gray-800 text-white p-4 sm:p-6 rounded-lg flex-1 border border-gray-500 shadow-md cursor-pointer hover:bg-gray-700 transition"
        onClick={() => navigate('/companies')}
      >
        <h3 className="text-2xl sm:text-3xl font-semibold mb-4">Companies</h3>
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-blue-600 font-medium">Loading companies...</p>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl sm:text-2xl font-bold">{companyCount}</span>
            <i className="fa fa-building text-3xl sm:text-4xl"></i>
          </div>
        )}
      </div>
    </div>

    {/* Graph Section */}
    <div className="mt-4 sm:mt-6">
      <div className="bg-gray-800 text-white p-4 sm:p-6 rounded-lg border border-gray-500 shadow-md">
        <h3 className="text-2xl sm:text-3xl font-semibold mb-4">Graph</h3>
        <UserGrowthGraph />
      </div>
    </div>
  </div>
</div>

  </div>
  );
};

export default Dashboard;
