import React, { useEffect, useRef, useState } from 'react'
import Subsidebar from './Subsidebar';
import { GoogleMap, Polygon, useJsApiLoader } from "@react-google-maps/api";
 

export const SendLocation = () => {

const [usersData, setUsersData] = useState([]);
const [userCount, setUserCount] = useState(0);
const [token, setToken] = useState('');
const [loading, setLoading] = useState(true);
const [sidebarOpen, setSidebarOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [currentpage, setCurrentpage] = useState(1);
const limit = 20;
  const [selecteduser, setSelectedUser] = useState(null)
  const [employeeId, setEmployeeId] = useState(null)
  const [showMapModal, setShowMapModal] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [areaId, setAreaId] = useState(null)
  const [dropdownVisibleId, setDropdownVisibleId] = useState(null);

const [dropdownDirection, setDropdownDirection] = useState('down'); // default direction
const dropdownRefs = useRef({}); // already assumed to exist



useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownVisibleId !== null &&
      dropdownRefs.current[dropdownVisibleId] &&
      !dropdownRefs.current[dropdownVisibleId].contains(event.target)
    ) {
      setTimeout(() => {
        setDropdownVisibleId(null);
      }, 100); // Delay to let dropdown option clicks complete
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [dropdownVisibleId]);

useEffect(() => {
  if (dropdownVisibleId && dropdownRefs.current[dropdownVisibleId]) {
    const buttonRect = dropdownRefs.current[dropdownVisibleId].getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const requiredHeight = 120; // approximate dropdown height
    setDropdownDirection(spaceBelow < requiredHeight ? 'up' : 'down');
  }
}, [dropdownVisibleId]);


  const mapContainerStyle = {
  width: '100%',
  height: '400px',
};
const [mapCenter, setMapCenter] = useState(null);
 
useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setMapCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    },
  );
}, []);
 const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: 'AIzaSyC3z5JZ7eoEF7i_Xh9KnUu2sIdDyndPtwE'
});

 

const saveMap = () => {
  SetLocation(); // always set the location (POST), regardless of existing areaId
};


 const getLocation = (item) => {
  const requestOptions = {
  method: "GET",
  redirect: "follow"
};
 
fetch(`https://tracking-backend-admin.vercel.app/v1/subAdmin/getAssignAreaToUser?locationId=${item.assignedAreaId}`, requestOptions)
  .then((response) => response.json())
  .then((result) => {
    console.log("getting the location ",result)
  const coords = result?.location?.polygon?.coordinates?.[0]
  if (Array.isArray(coords)) {
    setPolygonPoints(coords);
    const mid = Math.floor(coords.length / 2);
    setMapCenter({ lat: coords[mid][1], lng: coords[mid][0] });
  }
})
  .catch((error) => console.error(error));
}

const SetLocation = () => { 
  if (!polygonPoints.length) {
    alert("Please select a valid area");
    return;
  }

  console.log("polygonPoints being used in payload:", polygonPoints); // add this line

  const payload = {
    subAdminId: selecteduser?.id,
    userId: employeeId,
    location: {
      type: "Polygon",
      coordinates: [[...polygonPoints, polygonPoints[0]]], // close the polygon
    },
  };

  console.log("Payload being sent:", payload); // already added
 // for debugging

  fetch("https://tracking-backend-admin.vercel.app/v1/subAdmin/assignAreaToUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Server Error: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log("Success:", data);
      if(data.success == true){
        alert("Location for user updated successfully")
        console.log('locationsetsuccessfully',data)
      setShowMapModal(false);
      setPolygonPoints([]);}
      fetchUsers()
    })
    .catch((err) => {
      console.error("API Error:", err);
      alert("Something went wrong. Please check the console.");
    });
};

  //  fetching data 
    useEffect(() => {
      fetchUsers();
    },[currentpage,searchQuery]);

    function fetchUsers() {
      const token = localStorage.getItem('token');
      setToken(token);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setSelectedUser(storedUser)
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
  
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };
  const url = searchQuery
      ?`https://tracking-backend-admin.vercel.app/v1/subAdmin/searchUser?query=${searchQuery}&page=${currentpage}&limit=${limit}`
      :`https://tracking-backend-admin.vercel.app/v1/subAdmin/fetchUserList?page=${currentpage}&limit=${limit}&sortBy=created:desc`
      fetch(url,requestOptions)
      .then((response) => response.json())
        .then((result) => {
          if (result.success === true) {
            if (searchQuery) {
              console.log('searchuserlist',result)
              setUsersData(result.searchedUSer.data); // <-- correct field for search
              setUserCount(result.searchedUSer.totalResults);
              setLoading(false)
            } else {
              console.log("fetchuserlist",result)
              setUsersData(result.UserList.results); // <-- correct field for paginated list
              setUserCount(result.UserList.totalResults)
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
        <div className="flex-1 p-3 flex flex-col overflow-y-auto max-h-screen">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 bg-gray-800 rounded-xl p-2 shadow-lg sticky top-[3.75rem] z-20 mb-2">
    <input
      className="p-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 mb-2 sm:mb-0 mt-2"
            placeholder="Search Employee..."
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

       {/* Table Section */}
   <div className="rounded-xl overflow-x-auto shadow-2xl border border-black max-w-full">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full animate-spin-slow opacity-30"></div>
              </div>
              <p className="mt-4 text-blue-400 text-lg animate-pulse">Loading Employees...</p>
            </div>
          ) : (
            <table className="min-w-full table-auto bg-white text-black text-sm">

              <thead className="bg-gray-700">
                <tr>
                  {['Sr.no', 'Name', 'Email', 'Mobile Number', 'Company Name', 'Actions'].map((heading) => (
                   <th key={heading} className="py-1 text-center text-white font-semibold border-b-2 border-r-2 border-black font-serif sticky top-0 bg-gray-700 z-20">
                  {heading}
                </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usersData.map((item, index) => (
                  <tr key={item.id} className="bg-white  ">
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
                    <td className="border-b border-r border-gray-700 text-center">{item.phoneNumber}</td>
                    <td className="border-b border-r border-gray-700 text-center">{item.companyName}</td>
                    <td className="border-b border-r border-gray-700 text-center">
                      <div className="flex justify-center gap-4">
                <div
  className="relative"
  ref={(el) => {
    if (el) dropdownRefs.current[item.id] = el;
  }}
>
  <button
    onClick={() => {
      setDropdownVisibleId(dropdownVisibleId === item.id ? null : item.id);
    }}
    className="p-2 rounded-full hover:bg-blue-100 text-blue-500 hover:text-blue-800 transition"
    title="Set location"
  >
    <i className="bi bi-list-task text-lg"></i>
  </button>

  {/* Responsive Dropdown */}
  {dropdownVisibleId === item.id && (
    <div
      className={`absolute z-50 w-52 bg-black border border-gray-200 rounded-lg shadow-xl
              ${dropdownDirection === 'up' ? 'bottom-full mb-2' : 'mt-2'}
              right-0 sm:right-0 sm:left-auto left-0 sm:w-52 w-11/12 mx-auto sm:mx-0`}
    >
      {/* View Assigned Area Option */}
      {item.assignedAreaId && (
        <button
          onClick={() => {
            if (!item.assignedAreaId) {
              alert("Please set the location first.");
              return;
            }
            getLocation(item);
            setAreaId(item.assignedAreaId);
            setEmployeeId(item.id);
            setShowMapModal(true);
            setDropdownVisibleId(null);
          }}
          className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-blue-50 transition"
        >
          <i className="bi bi-eye-fill mr-2 text-blue-500"></i>
          View Assigned Area
        </button>
      )}

      {/* Set New Area Option */}
      <button
        onClick={() => {
          setPolygonPoints([]);
          setAreaId(null);
          setEmployeeId(item.id);
          setShowMapModal(true);
          setDropdownVisibleId(null);
        }}
        className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-green-50 transition"
      >
        <i className="fa fa-map-marker mr-2 text-green-600"></i>
        Set New Area
      </button>
    </div>
  )}
</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

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


     {showMapModal && isLoaded && (
  <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-60 flex justify-center items-center">
    <div className="bg-white p-4 rounded-xl w-full max-w-3xl h-[600px] flex flex-col">
      <div className="flex justify-center items-center mb-2">
      <h2 className="text-lg items-center text-red-700 font-semibold">
  ({areaId ? 'View Assigned Area' : 'Click on map to draw/select the area for user.'})
</h2>
      </div>
      <div className="flex-1 w-full rounded-lg overflow-hidden">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={15}
            onClick={(e) => {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              setPolygonPoints((prev) => [...prev, [lng, lat]]);
            }}
          >
            {polygonPoints.length > 0 && (
              <Polygon
                paths={[...polygonPoints.map(([lng, lat]) => ({ lat, lng })), { lat: polygonPoints[0][1], lng: polygonPoints[0][0] }]}
                options={{
                  fillColor: "#00FF00",
                  fillOpacity: 0.2,
                  strokeColor: "#00FF00",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
            )}
          </GoogleMap>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={saveMap}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={() => {
            setShowMapModal(false);
            setPolygonPoints([]);
          }}
          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
      </div>
  )
}
  