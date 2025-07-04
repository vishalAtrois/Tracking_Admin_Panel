import React, { useEffect, useState } from 'react';
import Subsidebar from './Subsidebar';

const SubPrefrences = () => {
  const [usersData, setUsersData] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentpage, setCurrentpage] = useState(1);
  const limit = 20;
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [permissions, setPermissions] = useState({
    trackHistory: true,
    adminRole: false,
    createAddress: true,
    createReports: false,
    viewContacts: true,
    createGroups: true,
    createNotes: false
  });

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
    ?`https://tracking-backend-admin.vercel.app/v1/subAdmin/searchUser?query=${searchQuery}&page=${currentpage}&limit=${limit}`
      : `https://tracking-backend-admin.vercel.app/v1/subAdmin/fetchUserList?page=${currentpage}&limit=${limit}&sortBy=created:desc`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success === true) {
          if (searchQuery) {
            setUsersData(result.searchedUSer.data);
            setUserCount(result.searchedUSer.totalResults);
          } else {
            setUsersData(result.UserList.results);
            setUserCount(result.UserList.totalResults);
          }
          setLoading(false);
        }
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    fetchUsers();
  }, [currentpage, searchQuery]);

  const npage = Math.ceil(userCount / limit);
  const pageNumbers = [];
  if (npage <= 4) {
    for (let i = 1; i <= npage; i++) pageNumbers.push(i);
  } else if (currentpage <= 2) {
    pageNumbers.push(1, 2, 3, '...', npage);
  } else if (currentpage >= npage - 1) {
    pageNumbers.push(1, '...', npage - 2, npage - 1, npage);
  } else {
    pageNumbers.push(currentpage - 1, currentpage, currentpage + 1, '...', npage);
  }

  const goToPrevPage = () => {
    if (currentpage > 1) setCurrentpage(currentpage - 1);
  };

  const goToNextPage = () => {
    if (currentpage < npage) setCurrentpage(currentpage + 1);
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900  overflow-x-hidden">
      <div className="md:hidden p-4 bg-gray-800 shadow-md z-50 flex items-center justify-start gap-4 sticky top-0.5">
        <button onClick={() => setSidebarOpen(true)} className="text-white focus:outline-none">
          <i className="bi bi-list text-3xl"></i>
        </button>
        <h2 className="text-white text-xl font-semibold">Tracking App</h2>
      </div>
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
      <div className={`fixed md:relative z-50 transform top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out bg-gray-800 shadow-lg ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Subsidebar />
      </div>
      <div className="flex-1 p-3 flex flex-col overflow-y-auto max-h-screen">
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
                  <tr key={item.id} className="bg-white">
                    <td className="border-b border-r border-gray-700 text-center">{(currentpage - 1) * limit + index + 1}</td>
      <td className="border-b border-r border-gray-700 text-center">
  <div className="flex items-center justify-center sm:justify-start gap-2 py-2 flex-wrap sm:flex-nowrap text-left">
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
                    <td className="border-b border-gray-700 text-center">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => {
                            setSelectedUserId(item.id);
                            const storedPermissions = JSON.parse(localStorage.getItem("userPermissions")) || {};
                            if (storedPermissions[item.id]) {
                              setPermissions(storedPermissions[item.id]);
                            } else {
                              setPermissions({
                                trackHistory: true,
                                adminRole: false,
                                createAddress: true,
                                createReports: false,
                                viewContacts: true,
                                createGroups: true,
                                createNotes: false
                              });
                            }
                            setShowPermissionModal(true);
                          }}
                          className="p-2 rounded-full hover:bg-green-100 text-green-500 hover:text-green-800 transition"
                          title="Set Permissions"
                        >
                          <i className="fa fa-cogs text-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showPermissionModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white text-black p-6 rounded-xl shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Set Permissions</h2>
              <div className="space-y-3">
                {Object.keys(permissions).map((key) => (
                  <div key={key} className="flex justify-between items-center">
                    <label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      type="checkbox"
                      checked={permissions[key]}
                      onChange={() => {
                        setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6 space-x-2">
                <button onClick={() => setShowPermissionModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                  Cancel
                </button>
               <button
  onClick={async () => {
    try {
      // Save to localStorage
      const allPermissions = JSON.parse(localStorage.getItem("userPermissions")) || {};
      allPermissions[selectedUserId] = permissions;
      localStorage.setItem("userPermissions", JSON.stringify(allPermissions));

      // Send to backend
      const response = await fetch(
        `https://tracking-backend-admin.vercel.app/v1/subAdmin/setPermission?userId=${selectedUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ permissions }),
        }
      );

      const result = await response.json();
      if (result.success) {
        console.log("Permissions updated on server:", result);
        alert('Permissions updated successfully')
        setShowPermissionModal(false);
      } else {
        console.error("Server error:", result.message || "Unknown error");
      }
    } catch (error) {
      console.error("Failed to update permissions:", error);
    }
  }}
  className="px-4 py-2 bg-blue-600 text-white rounded"
>
  Save
</button>

              </div>
            </div>
          </div>
        )}

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
                      style={{ backgroundColor: currentpage === num ? '#00b6f0' : 'white', color: currentpage === num ? 'white' : 'black', cursor: 'pointer' }}
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
  );
};

export default SubPrefrences;
