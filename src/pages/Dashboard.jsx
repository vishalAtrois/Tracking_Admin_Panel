import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
 

const Dashboard = () => {

  
  const [userCount, setUserCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
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
        }
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    fetchUsers();
    fetchCompany()
  }, []);

  return (
    <div className="flex h-screen overflow-auto  bg-gray-900">
    <Sidebar />
    <div className="flex-1 p-6 bg-gray-900 ml-64">
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg min-h-screen">
      <h2 className="text-white text-3xl mb-6">Dashboard</h2>

      {/* User and Company Cards */}
      <div className="flex space-x-6 overflow-auto">
        {/* User Section */}
        <div
          className="bg-gray-800 text-white p-6 rounded-lg flex-1 border border-gray-500 shadow-md cursor-pointer hover:bg-gray-700 transition"
          onClick={() => navigate('/users')}
        >
          <h3 className="text-3xl font-semibold mb-4">Users</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">{userCount}</span>
            <i className="fa fa-user text-4xl"></i>
          </div>
        </div>

        {/* Company Section */}
        <div
          className="bg-gray-800 text-white p-6 rounded-lg flex-1 border border-gray-500 shadow-md cursor-pointer hover:bg-gray-700 transition"
          onClick={() => navigate('/companies')}
        >
          <h3 className="text-3xl font-semibold mb-4">Companies</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">{companyCount}</span>
            <i className="fa fa-building text-4xl"></i>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Dashboard;
