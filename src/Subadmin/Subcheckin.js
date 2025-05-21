import React, { useEffect, useState } from 'react'
import Subsidebar from './Subsidebar';

export const  Subcheckin = () => {

  const [usersData, setUsersData] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
     const [sidebarOpen, setSidebarOpen] = useState(false);
     const [searchQuery, setSearchQuery] = useState('');
    const [currentpage, setCurrentpage] = useState(1);
    const limit = 10;
    const [showLogsModal, setShowLogsModal] = useState(false);
const [logsData, setLogsData] = useState([]);

   
  
   
      //  fetching data 
    useEffect(() => {
      fetchUsers();
    },[currentpage,searchQuery]);

 


function GetReports(item) {
  const token = localStorage.getItem('token');
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  fetch(`https://tracking-backend-admin.vercel.app/v1/subAdmin/getUserCheckInOutTimes?userId=${item.id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.success === true) {
        console.log("logs data ",result)
        setLogsData(result.List.logs || []);
        setShowLogsModal(true);
      }
    })
    .catch((error) => console.error("Error fetching reports", error));
}


  
    function fetchUsers() {
      const token = localStorage.getItem('token');
      setToken(token);
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
  
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };
  const url = searchQuery
      ?`https://tracking-backend-admin.vercel.app/v1/admin/searchUser?query=${searchQuery}&page=${currentpage}&limit=${limit}`
      :`https://tracking-backend-admin.vercel.app/v1/subAdmin/fetchUserList?page=${currentpage}&limit=${limit}&sortBy=created:desc`
      fetch(url,requestOptions)
      .then((response) => response.json())
        .then((result) => {
          if (result.success === true) {
            if (searchQuery) {
              console.log("Search API response:", result);
              setUsersData(result.searchedUSer.data); // <-- correct field for search
              setUserCount(result.searchedUSer.totalResults);
              setLoading(false)
            } else {
              console.log("Fetch  user List response:", result);
              setUsersData(result.UserList.results); // <-- correct field for paginated list
              setUserCount(result.UserList.totalResults);
              setLoading(false)
            }
          }
        })
        .catch((error) => console.error(error));
    }
   
    // Logic part
  const npage = Math.ceil(userCount / limit);
  const pageNumbers = [];
  
  if (npage <= 4) {
    for (let i = 1; i <= npage; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentpage <= 2) {
      pageNumbers.push(1, 2, 3, '...', npage);
    } else if (currentpage >= npage - 1) {
      pageNumbers.push(1, '...', npage - 2, npage - 1, npage);
    } else {
      pageNumbers.push(currentpage - 1, currentpage, currentpage + 1, '...', npage);
    }
  }
  
  const goToPrevPage = () => {
    if (currentpage > 1) setCurrentpage(currentpage - 1);
  };
  
  const goToNextPage = () => {
    if (currentpage < npage) setCurrentpage(currentpage + 1);
  };
  
    
  
   const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };
  
 
  
  
    
  return (
      <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900">
    
          {/* side bar button */}
        <div className="md:hidden p-4 bg-gray-800 shadow-md z-50 flex items-center justify-start gap-4 sticky top-0.5">
      <button onClick={() => setSidebarOpen(true)} className="text-white focus:outline-none">
        <i className="bi bi-list text-3xl"></i>
      </button>
      <h2 className="text-white text-xl font-semibold">Tracking App</h2>
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
          <Subsidebar />
        </div>
    
        <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-white text-2xl sm:text-3xl mb-6 -mt-2 sm:-mt-4 font-bold tracking-wide">
              Check Logs
            </h2>
    
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 bg-gray-800 rounded-xl p-2 shadow-lg sticky top-0 z-20 mb-4">
          <input
            className="p-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 mb-2 sm:mb-0 mt-2"
            placeholder="Search Employee..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            title="Search"
            className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-white w-full sm:w-auto mt-1"
            onClick={fetchUsers}
          >
            Search
          </button>
        </div>
    
       {/* Table Section */}
       <div className="rounded-xl overflow-x-auto shadow-lg border border-gray-700">
        
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full animate-spin-slow opacity-30"></div>
              </div>
              <p className="mt-4 text-blue-400 text-lg animate-pulse">Loading Employees...</p>
            </div>
          ) : (
            <table className="min-w-full table-auto bg-gray-900 text-white">
              <thead className="bg-gray-700">
                <tr>
                  {['Sr.no', 'Name', 'Email', 'Mobile Number', 'Company Name', 'Logs'].map((heading) => (
                    <th key={heading} className="py-1 text-center font-semibold border-b border-r  border-gray-600 font-serif">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usersData.map((item, index) => (
                  <tr key={item.id} className="bg-gray-800  ">
                    <td className="border-b border-r border-gray-700 text-center">{(currentpage - 1) * limit + index + 1}</td>
                    <td className="border-b border-r border-gray-700 text-center">{item.fullName}</td>
                    <td className="border-b border-r border-gray-700 text-center">{item.email}</td>
                    <td className="border-b border-r border-gray-700 text-center">{item.phoneNumber}</td>
                    <td className="border-b border-r border-gray-700 text-center">{item.companyName}</td>
                    <td className="border-b border-gray-700 text-center">
                      <div className="flex justify-center gap-4">
                        {/* report section */}
                     <button
                          onClick={() => GetReports(item)}
                          className="p-2 rounded-full hover:bg-blue-100 text-blue-500 hover:text-blue-800 transition"
                          title="Logs"
                        >
                          <i className="fa fa-sticky-note text-lg"></i>
                        </button>
 
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

{/* logs modal  */}
 

 {showLogsModal && (
<div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto p-4">
    <div className="relative w-full max-w-6xl mx-auto my-[80.5rem] mb-10 bg-white rounded-xl shadow-xl border p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
        <h3 className="text-xl font-bold text-gray-800">Logs</h3>
        <button
          className="text-gray-600 hover:text-red-500 text-3xl font-bold"
          onClick={() => setShowLogsModal(false)} 
          title='close'
        > 
          &times;
        </button>
      </div>

       

      {logsData.length > 0 ? (
        <div className="max-h-128 overflow-y-auto">
          <table className="w-full text-left text-sm border border-gray-300">
            <thead className="sticky top-0 bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-4 py-2 text-center">Check-In</th>
                <th className="border px-4 py-2 text-center">Check-Out</th>
                <th className="border px-4 py-2 text-center">Alarms</th>
              </tr>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border px-4 py-2 text-center">Date/Time</th>
                <th className="border px-4 py-2 text-center">Date/Time</th>
                <th className="border px-4 py-2 text-center">—</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {logsData.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">
                    {new Date(log.checkInTime).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {new Date(log.checkOutTime).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2 text-center">{log.alarmLogs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No logs found.</p>
      )}
    </div>
  </div>
)}

    
      {/* Pagination UI */}
      <div className="custom-pagination-container flex justify-center mt-4">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className={`page-item ${currentpage === 1 ? 'disabled' : ''}`}>
              <a onClick={goToPrevPage} className="page-link" aria-label="Previous">
                <span aria-hidden="true">«</span>
              </a>
            </li>
            {pageNumbers.map((num, index) => (
              <li className={`page-item ${num === currentpage ? 'active' : ''}`} key={index}>
                {num === '...' ? (
                  <span className="page-link">...</span>
                ) : (
                  <span
                    onClick={() => setCurrentpage(num)}
                    className="page-link"
                    style={{
                      backgroundColor: currentpage === num ? '#00b6f0' : 'white',
                      color: currentpage === num ? 'white' : 'black',
                      cursor: 'pointer'
                    }}
                  >
                    {num}
                  </span>
                )}
              </li>
            ))}
            <li className={`page-item ${currentpage === npage ? 'disabled' : ''}`}>
              <a onClick={goToNextPage} className="page-link" aria-label="Next">
                <span aria-hidden="true">»</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
      </div>
    
  )
}
  