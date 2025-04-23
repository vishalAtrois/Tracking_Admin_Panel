import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserGrowthGraph from '../pages/UserGrowthGraph';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {

  const [usersData, setUsersData] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [companyCount, setCompanyCount] = useState(0);
  const navigate = useNavigate();

  function fetchUsers (){

    

    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch("http://16.171.60.57:3001/v1/admin/fetchUserList?page=1&limit=10&userType=user", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if(result.success == true){
          console.log(result.UserList);
          setUsersData(result.UserList.results)
          setUserCount(result.UserList.totalResults)
        }
      })
      .catch((error) => console.error(error));
  }

  function fetchCompany(){
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch("http://16.171.60.57:3001/v1/admin/fetchCompanyList?page=1&limit=10", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if(result.success == true){
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
    <div className="flex h-screen overflow-auto">
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

      {/* Graph and Other Content */}
      <div className="flex space-x-6 mt-6">
        <div className="w-1/2">
          <UserGrowthGraph />
        </div>
      </div>

      {/* Company List */}
      <div className="mt-10">
        <h3 className="text-xl text-white font-semibold mb-4">Companies List</h3>
        <div className="space-y-4">
          {companies.map((company) => (
            <div
              key={company._id}
              className="bg-gray-800 p-4 rounded-lg border border-gray-600 text-white"
            >
              <h4 className="text-lg font-bold">{company.name}</h4>
              <p className="text-sm mb-1">
                <span className="font-semibold">Description:</span> {company.description}
              </p>
              <p className="text-sm mb-1">
                <span className="font-semibold">Address:</span> {company.address}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Total Employees:</span> {company.totalEmployees}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Dashboard;
