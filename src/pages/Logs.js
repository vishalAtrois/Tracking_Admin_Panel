import React, { useEffect, useState } from 'react'
 import { Smartphone } from "lucide-react";
import Sidebar from '../components/Sidebar';
import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';

export const  Logs = () => {

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
  const [selectedLocation, setSelectedLocation] = useState(null); // new state for map location
  const [showMapModal, setShowMapModal] = useState(false);


   
  
   
      //  fetching data 
    useEffect(() => {
      fetchUsers();
    },[currentpage,searchQuery]);

 



function GetReports(item) {
  const token = localStorage.getItem('token');

  fetch(`https://tracking-backend-admin.vercel.app/v1/admin/getUserCheckInOutTimes?userId=${item.id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    redirect: "follow"
  })
    .then(res => res.json())
    .then((response) => {
      console.log("API Response for GetReports:", response); 

      const { success, List } = response;
      if (!success || !List?.logs) return;

      const logs = Object.entries(List.logs).flatMap(([date, { timing = [], locations = [] }]) =>
        (timing || []).map(entry => ({
          date,
          checkInTime: entry.checkInTime,
          checkOutTime: entry.checkOutTime,
          alarmLogs: entry.alarmLogs || [],
          location: locations.length > 0 ? locations : null, // attach full locations array or null
          // Or you could use locations[0] if you want just the first location
        }))
      );

      setLogsData(logs);
      setShowLogsModal(true);
      setSelectedLocation(null);
    })
    .catch(err => console.error("Error fetching reports", err));
}


   const mapContainerStyle = {
    height: '500px',
    width: '100%',
    marginTop: '1rem',
  };


  
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
      :`https://tracking-backend-admin.vercel.app/v1/admin/fetchUserList?page=${currentpage}&limit=${limit}&sortBy=createdAt:desc`
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
     <LoadScript googleMapsApiKey="AIzaSyC3z5JZ7eoEF7i_Xh9KnUu2sIdDyndPtwE">
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
           <Sidebar />
        </div>
    
        <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-white text-2xl sm:text-3xl mb-6 -mt-2 sm:-mt-4 font-bold tracking-wide">
              Logs
            </h2>
      {/* The rest of your component (search bar, table, pagination, modals, etc.) remains exactly the same */}
    
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 bg-gray-800 rounded-xl p-2 shadow-lg sticky top-0 z-20 mb-4">
          <input
            className="p-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 mb-2 sm:mb-0 mt-2"
            placeholder="Search User..."
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
              <p className="mt-4 text-blue-400 text-lg animate-pulse">Loading user...</p>
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
                          <i className="fa fa-sticky-note"></i>
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
             <div className="relative w-full max-w-6xl mx-auto my-20 bg-white rounded-xl shadow-xl border p-4 sm:p-6">
               <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
                 <h3 className="text-xl font-bold text-gray-800">Logs</h3>
                 <button
                   className="text-red-500 text-4xl font-bold"
                   onClick={() => setShowLogsModal(false)}
                   title="close"
                 >
                   &times;
                 </button>
               </div>
   
               {logsData.length > 0 ? (
                 <>
                   <div className="max-h-[32rem] overflow-y-auto rounded-lg shadow-lg border-2 border-gray-500">
                     <table className="min-w-full text-sm text-left border-collapse">
                       <thead className="sticky top-0 z-10 bg-blue-200 text-blue-900 font-bold uppercase text-[13px] tracking-wider border-b-2 border-gray-500">
                         <tr>
                           <th className="border-3 border-gray-500 px-4 py-3 text-center">Check-In</th>
                           <th className="border-3 border-gray-500 px-4 py-3 text-center">Check-Out</th>
                           <th className="border-3 border-gray-500 px-4 py-3 text-center">Alarms</th>
                           <th className="border-3 border-gray-500 px-4 py-3 text-center">Location</th> {/* New column */}
                         </tr>
                       </thead>
                       <tbody className="text-gray-800 font-medium">
                         {logsData.map((log, index) => (
                           <tr
                             key={index}
                             className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                           >
                             <td className="border-3 border-gray-500 px-4 py-3 text-center">
                               {new Date(log.checkInTime).toLocaleString()}
                             </td>
                             <td className="border-3 border-gray-500 px-4 py-3 text-center">
                               {new Date(log.checkOutTime).toLocaleString()}
                             </td>
                             <td className="border-3 border-gray-500 px-4 py-3 text-center">
                               {log.alarmLogs && log.alarmLogs.length > 0 ? (
                                 <div className="flex justify-center gap-3 flex-wrap">
                                   {log.alarmLogs.slice(0, 3).map((alarm) => (
                                     <span
                                       key={alarm._id}
                                       title={`Turned off by ${alarm.turnedOffBy} at ${new Date(
                                         alarm.time
                                       ).toLocaleTimeString()}`}
                                       className="inline-block"
                                     >
                                       <Smartphone
                                         size={24}
                                         strokeWidth={2.5}
                                         className={`rounded-full p-1 shadow-sm ${
                                           alarm.turnedOffBy === "user"
                                             ? "text-green-700 bg-green-100"
                                             : "text-red-700 bg-red-100"
                                         }`}
                                       />
                                     </span>
                                   ))}
                                 </div>
                               ) : (
                                 <span className="text-gray-400 italic">No alarms</span>
                               )}
                             </td>
                             <td className="border-3 border-gray-500 px-4 py-3 text-center">
                               {log.location ? (
                                 <button
                                  onClick={() => {
                                                  setSelectedLocation(log.location);
                                            setShowLogsModal(false);
                                           setShowMapModal(true);
                                              }}
   
                                   className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                                 >
                                   Show Location
                                 </button>
                               ) : (
                                 <span className="text-gray-400 italic">No location</span>
                               )}
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
   
                   
                 </>
               ) : (
                 <p className="text-gray-600 italic mt-4 text-center">No logs found.</p>
               )}
             </div>
           </div>
         )}
   
   
         {/* location view  */}
   
   
       {showMapModal && selectedLocation && Array.isArray(selectedLocation) && (
     <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto p-4">
       <div className="relative w-full max-w-4xl mx-auto my-20 bg-white rounded-xl shadow-xl border p-4 sm:p-6">
         {/* Header */}
          
         <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
          <button
             onClick={() => {
               setShowMapModal(false);
               setShowLogsModal(true);
             }}
             className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
           >
             ← Back to Logs
           </button>
{/*           
           <h3 className="text-xl font-bold text-gray-800  text-center flex-grow">Location View</h3> */}
           <button
             onClick={() => {
               setShowMapModal(false);
               setSelectedLocation(null);
             }}
             className="text-red-500 text-4xl font-bold"
           >
             &times;
           </button>
         </div>
   
         {/* Google Map Wrapper */}
       
           <GoogleMap
             mapContainerStyle={mapContainerStyle}
             center={{
               lat: selectedLocation[0]?.latitude || 0,
               lng: selectedLocation[0]?.longitude || 0
             }}
             zoom={15}
           >
             {selectedLocation.map((loc, idx) => (
               <Marker
                 key={idx}
                 position={{ lat: loc.latitude, lng: loc.longitude }}
               />
             ))}
              <Polygon
       paths={selectedLocation.map((loc) => ({
         lat: loc.latitude,
         lng: loc.longitude
       }))}
       options={{
         fillColor: "#FF0000",
         fillOpacity: 0.2,
         strokeColor: "#FF0000",
         strokeOpacity: 0.8,
         strokeWeight: 2,
         clickable: false,
         draggable: false,
         editable: false,
         geodesic: false,
         zIndex: 1
       }}
     />
           </GoogleMap>
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
      </LoadScript>
    
  )
}
  