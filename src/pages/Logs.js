import React, { useEffect, useState } from 'react'
 import { Smartphone } from "lucide-react";
import Sidebar from '../components/Sidebar';
import { GoogleMap, useJsApiLoader, Marker, Polygon } from '@react-google-maps/api';

export const  Logs = () => {

  const [usersData, setUsersData] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
     const [sidebarOpen, setSidebarOpen] = useState(false);
     const [searchQuery, setSearchQuery] = useState('');
    const [currentpage, setCurrentpage] = useState(1);
    const limit = 20;
    const [showLogsModal, setShowLogsModal] = useState(false);
const [logsData, setLogsData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null); // new state for map location
  const [showMapModal, setShowMapModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryData, setSummaryData] = useState('');
  
  
  const fetchWorkSummary = (activityId) => {
    // const token = localStorage.getItem("Admintoken");
    if (!token ) {
      console.error("Missing token ");
      return;
    }
      if ( !activityId) {
      console.error("Missing   activity ID");
      return;
    }
  
    fetch(`https://tracking-backend-admin.vercel.app/v1/subAdmin/getWorkSummary?employeeActivityId=${activityId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      redirect: "follow",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.summary) {
          setSummaryData(result.summary);
          setShowSummaryModal(true);
        }
      })
      .catch((err) => console.error("Error fetching summary:", err));
  };

const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: 'AIzaSyC3z5JZ7eoEF7i_Xh9KnUu2sIdDyndPtwE'
});
  
      //  fetching data 
    useEffect(() => {
      fetchUsers();
    },[currentpage,searchQuery]);

function GetReports(item) {
  const token = localStorage.getItem('Admintoken');

  fetch(`https://tracking-backend-admin.vercel.app/v1/admin/getUserCheckInOutTimes?userId=${item.id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    redirect: "follow"
  })
    .then(res => res.json())
    .then((response) => {
      const { success, List } = response;

      if (!success || !List?.logs) return;

      const logs = Object.entries(List.logs).flatMap(([date, logData]) =>
        (logData.timing || []).map(entry => ({
          _id: entry._id,
          date,
          checkInTime: entry.checkInTime,
          checkOutTime: entry.checkOutTime,
          alarmLogs: entry.alarmLogs || [],
          location: logData.locations?.length ? logData.locations : null,
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
      const token = localStorage.getItem('Admintoken');
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
              setUsersData(result.searchedUSer.data);  
              setUserCount(result.searchedUSer.totalResults);
              setLoading(false)
            } else {
              setUsersData(result.UserList.results);  
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
    
      <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900 overflow-x-hidden">
    
          {/* side bar button */}
        <div className="md:hidden p-2 bg-gray-800 shadow-md z-50 flex items-center justify-start gap-4 sticky top-0.5">
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
    
<div className="flex-1 p-3 flex flex-col overflow-y-auto max-h-screen">

  

  {/* Search Bar */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 bg-gray-800 rounded-xl p-2 shadow-lg sticky top-[3.75rem] z-20 mb-2">
    <input
      className="p-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 mb-2 sm:mb-0 mt-2"
      placeholder="Search User..."
      value={searchQuery}
      onChange={handleSearchChange}
    />
    {/* <button
      title="Search"
      className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-white w-full sm:w-auto mt-1"
      onClick={fetchUsers}
    >
      Search
    </button> */}
  </div>

  {/* Scrollable Table Container */}
    <div className="rounded-xl overflow-x-auto shadow-lg border border-black max-w-full">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full animate-spin-slow opacity-30"></div>
              </div>
              <p className="mt-4 text-blue-400 text-lg animate-pulse">Loading user...</p>
            </div>
          ) : (
           <table className="min-w-full table-auto bg-white text-black text-sm">
              <thead className="bg-gray-700">
                <tr>
                  {['Sr.no', 'Name', 'Email', 'Company Name', 'Open Logs'].map((heading) => (
                    <th key={heading} className="py-1 text-center text-white font-semibold border-b border-r border-gray-600 font-serif sticky top-0 bg-gray-700 z-20">
                  {heading}
                </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usersData.map((item, index) => (
                  <tr key={item.id} className="bg-white">
                    <td className="border-b border-r border-gray-700 text-center">{(currentpage - 1) * limit + index + 1}</td>
                          <td className="border-b border-r border-gray-700 text-center">
  <div className="flex items-center justify-center sm:justify-start gap-2 py-2 pl-6 flex-wrap sm:flex-nowrap text-left">
    <img
      src={item.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
      className="w-10 h-10 object-cover rounded-full"
      alt=""
    />
    <span className="text-sm font-medium break-words max-w-[100px] sm:max-w-none">
      {item.fullName}
    </span>
  </div>
</td>
                    <td className="border-b border-r border-gray-700 text-center">{item.email}</td>
                    <td className="border-b border-r border-gray-700 text-center">{item.companyName}</td>
                    <td className="border-b border-gray-700 text-center">
                      <div className="flex justify-center gap-4">
                        {/* report section */}
                     <button
                          onClick={() => GetReports(item)}
                          className="p-2 rounded-full hover:bg-blue-100 text-blue-500 hover:text-blue-800 transition"
                          title="Logs"
                        >Open logs for {item.fullName}
                          {/* <i className="fa fa-sticky-note"></i> */}
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
     <div className="fixed inset-0 z-50 bg-black bg-opacity-50 p-4 flex justify-center items-center">
       <div className="relative w-full max-w-6xl mx-auto my-20 bg-white rounded-xl shadow-xl border p-4 sm:p-6 max-h-[90vh] flex flex-col">
         
         {/* Header */}
         <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 flex-shrink-0">
           <h3 className="text-xl font-bold text-gray-800">Logs</h3>
           <button
             className="text-red-500 text-4xl font-bold"
             onClick={() => setShowLogsModal(false)}
             title="close"
           >
             &times;
           </button>
         </div>
   
         {/* Logs table */}
           {logsData.length > 0 ? (
                <div className="overflow-y-auto rounded-lg shadow-lg border-2 border-gray-500"
                     style={{ maxHeight: 'calc(90vh - 5rem)' }} // adjust to leave space for header + padding
                >
                  <table className="min-w-full text-sm text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-blue-200 text-blue-900 font-bold uppercase text-[13px] tracking-wider border-b-2 border-gray-500">
                      <tr>
                        <th className="border-3 border-gray-500 px-4 py-3 text-center">User Check-In</th>
                        <th className="border-3 border-gray-500 px-4 py-3 text-center">User Check-Out</th>
                        <th className="border-3 border-gray-500 px-4 py-3 text-center">Alarms</th>
                        <th className="border-3 border-gray-500 px-4 py-3 text-center">Location</th>
                         <th className="border-3 border-gray-500 px-4 py-3 text-center">Work Summary</th>
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
                         <td className="border-3 border-gray-500 px-4 py-3 text-center">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => fetchWorkSummary(log._id)}
          >
            View more data
          </button>
        </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 italic mt-4 text-center">No logs found.</p>
              )}
       </div>
     </div>
   )}
   
   
   
         {/* location view  */}
   
   {showMapModal && selectedLocation && Array.isArray(selectedLocation) && isLoaded && (
     <div className="fixed inset-0 z-50 bg-black bg-opacity-50 p-4 flex justify-center items-center">
       <div className="relative w-full max-w-4xl mx-auto my-20 bg-white rounded-xl shadow-xl border p-4 sm:p-6 max-h-[90vh] flex flex-col">
   
         {/* Header */}
         <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 flex-shrink-0">
           <button
             onClick={() => {
               setShowMapModal(false);
               setShowLogsModal(true);
             }}
             className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
           >
             ← Back to Logs
           </button>
   
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
   
         {/* Map Container - FIXED HEIGHT wrapper to let Google Map display */}
       
           <GoogleMap
             mapContainerStyle={mapContainerStyle} // keep your existing style here
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
                 icon={{
                   url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4//8/AwAI/AL+YRm3VwAAAABJRU5ErkJggg==",
                   scaledSize: new window.google.maps.Size(1, 1)
                 }}
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
 
 {/* activity modal */}

{showSummaryModal && summaryData && (
<div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto flex justify-center items-center p-4">
<div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
 
      {/* Close Button */}
<button

        onClick={() => setShowSummaryModal(false)}

        className="absolute top-2 right-2 text-red-600 text-2xl font-bold"

        title="Close"
>
&times;
</button>
 
      <h2 className="text-xl font-bold text-gray-800 mb-4">Work Summary</h2>
 
      {/* Convert minutes to hours & minutes */}

      {(() => {

        const convertMinutesToTime = (minuteString) => {

          const totalMinutes = parseFloat(minuteString);

          if (isNaN(totalMinutes)) return 'N/A';
 
          const hours = Math.floor(totalMinutes / 60);

          const minutes = Math.floor(totalMinutes % 60);

          const seconds = Math.floor(((totalMinutes % 1) * 60));
 
          let result = '';

          if (hours > 0) result += `${hours} hour${hours > 1 ? 's' : ''} `;

          if (minutes > 0) result += `${minutes} minute${minutes > 1 ? 's' : ''} `;

          if (seconds > 0) result += `${seconds} second${seconds > 1 ? 's' : ''}`;
 
          return result.trim() || '0 minutes';

        };
 
        return (
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div>
<p className="text-sm text-gray-500 font-semibold">Date</p>
<p className="text-gray-900">

                {summaryData.date ? new Date(summaryData.date).toLocaleDateString() : 'N/A'}
</p>
</div>
 
            <div>
<p className="text-sm text-gray-500 font-semibold">Expected Duration</p>
<p className="text-gray-900">

                {summaryData.expectedWorkingHours

                  ? convertMinutesToTime(parseFloat(summaryData.expectedWorkingHours) * 60)

                  : 'N/A'}
</p>
</div>
 
            <div>
<p className="text-sm text-gray-500 font-semibold">Actual Duration</p>
<p className="text-gray-900">

                {summaryData.actualWorkingHours

                  ? convertMinutesToTime(parseFloat(summaryData.actualWorkingHours) * 60)

                  : 'N/A'}
</p>
</div>
 
            <div>
<p className="text-sm text-gray-500 font-semibold">Underwork</p>
<p className="text-gray-900">

                {summaryData.underwork

                  ? convertMinutesToTime(parseFloat(summaryData.underwork) * 60)

                  : 'N/A'}
</p>
</div>
 
            <div>
<p className="text-sm text-gray-500 font-semibold">Overwork</p>
<p className="text-gray-900">

                {summaryData.overwork

                  ? convertMinutesToTime(parseFloat(summaryData.overwork) * 60)

                  : 'N/A'}
</p>
</div>
 
            <div>
<p className="text-sm text-gray-500 font-semibold">Late Check-in</p>
<p className="text-gray-900">

                {summaryData.lateCheckIn

                  ? convertMinutesToTime(parseFloat(summaryData.lateCheckIn) * 60)

                  : 'N/A'}
</p>
</div>
 
            <div>
<p className="text-sm text-gray-500 font-semibold">Early Check-out</p>
<p className="text-gray-900">

                {summaryData.earlyCheckOut

                  ? convertMinutesToTime(parseFloat(summaryData.earlyCheckOut) * 60)

                  : 'N/A'}
</p>
</div>
 
            <div>
<p className="text-sm text-gray-500 font-semibold">Admin Check-in</p>
<p className="text-gray-900">

                {summaryData.adminCheckIn

                  ? new Date(summaryData.adminCheckIn).toLocaleTimeString()

                  : 'N/A'}
</p>
</div>
 
            <div>
<p className="text-sm text-gray-500 font-semibold">Admin Check-out</p>
<p className="text-gray-900">

                {summaryData.adminCheckOut

                  ? new Date(summaryData.adminCheckOut).toLocaleTimeString()

                  : 'N/A'}
</p>
</div>
 
            <div>
<p className="text-sm text-gray-500 font-semibold">User Check-in</p>
<p className="text-gray-900">

                {summaryData.userCheckIn

                  ? new Date(summaryData.userCheckIn).toLocaleTimeString()

                  : 'N/A'}
</p>
</div>
 
            <div>
<p className="text-sm text-gray-500 font-semibold">User Check-out</p>
<p className="text-gray-900">

                {summaryData.userCheckOut

                  ? new Date(summaryData.userCheckOut).toLocaleTimeString()

                  : 'N/A'}
</p>
</div>
</div>

        );

      })()}
</div>
</div>

)}
   
    
      {/* Pagination UI */}
      <div className="custom-pagination-container flex justify-center mt-2">
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
  