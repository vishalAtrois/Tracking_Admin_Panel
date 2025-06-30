import React, { useEffect, useState } from 'react';
import Subsidebar from './Subsidebar';

const SubAdminPreferences = () => {
 const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentpage, setCurrentpage] = useState(1);
  const [limit] = useState(20);
  const [userCount, setUserCount] = useState(0);
  const [token, setToken] = useState('');
  const [permissionModal, setPermissionModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [permissions, setPermissions] = useState({
    trackHistory: true,
    adminRole: false,
    createAddress: true,
    createReports: false,
    viewContacts: true,
    createGroups: true,
    createNotes: true
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUsers(savedToken, currentpage, limit, searchQuery);
    }
  }, [currentpage, searchQuery]);

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
      ? `https://tracking-backend-admin.vercel.app/v1/subAdmin/searchSubAdmin?query=${searchQuery}&page=${currentpage}&limit=${limit}`
      : `https://tracking-backend-admin.vercel.app/v1/subAdmin/fetchSubAdminList?page=${currentpage}&limit=${limit}&sortBy=created%3Adesc`;

    setLoading(true);

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        if (result.success === true) {
          if (searchQuery) {
            setUsersData(result.searchedUSer?.data || []);
            setUserCount(result.searchedUSer?.totalResults || 0);
          } else {
            setUsersData(result.UserList?.results || []);
            setUserCount(result.UserList?.totalResults || 0);
          }
        } else {
          setUsersData([]);
          setUserCount(0);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
const handleSetPermissionClick = (userId) => {
  setSelectedUserId(userId);
  setPermissionModal(true);

  // Load existing permissions from localStorage using the correct key
  const storedPermissions = localStorage.getItem(`adminpermissions-${userId}`);
  if (storedPermissions) {
    setPermissions(JSON.parse(storedPermissions));
  } else {
    // Reset to default if none saved
    setPermissions({
      trackHistory: true,
      adminRole: false,
      createAddress: true,
      createReports: false,
      viewContacts: true,
      createGroups: true,
      createNotes: true
    });
  }
};


  const confirmSetPermissions = () => {
    if (!selectedUserId) return;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      userId: selectedUserId,
      permissions
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://tracking-backend-admin.vercel.app/v1/subAdmin/setAdminPermission", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        localStorage.setItem(`adminpermissions-${selectedUserId}`, JSON.stringify(permissions)); // Save to localStorage
        setPermissionModal(false);
        setSelectedUserId(null);
      })
      .catch((error) => console.error("Permission error:", error));
  };

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

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900 overflow-x-hidden">
      {/* Sidebar */}
      <div className="md:hidden p-4 bg-gray-800 shadow-md z-50 flex items-center justify-start gap-4">
        <button onClick={() => setSidebarOpen(true)} className="text-white">
          <i className="bi bi-list text-3xl"></i>
        </button>
        <h2 className="text-white text-xl font-semibold">Tracking App</h2>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      <div className={`fixed md:relative z-50 transform top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out bg-gray-800 shadow-lg ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Subsidebar />
      </div>

      {/* Content */}
      <div className="flex-1 p-3 flex flex-col overflow-y-auto max-h-screen">
        {/* Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 bg-gray-800 rounded-xl p-2 shadow-lg sticky top-[3.75rem] z-20 mb-2">
          <input
            className="p-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 mb-2 sm:mb-0 mt-2"
            placeholder="Search SubAdmin..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-white w-full sm:w-auto mt-1"
            onClick={() => fetchUsers(token, 1, limit, searchQuery)}
          >
            Search
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-x-auto shadow-lg border border-gray-700 max-w-full">
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full animate-spin-slow opacity-30"></div>
          </div>
          <p className="mt-4 text-blue-400 text-lg animate-pulse">Loading subAdmins...</p>
        </div>
      ) : (
        <table className="min-w-full table-auto bg-gray-900 text-white text-sm">
          <thead className="bg-gray-700">
            <tr>
              {['Sr.no', 'Name', 'Email', 'Mobile Number', 'Company Name', 'Set Preferences'].map((heading) => (
                <th key={heading} className="py-1 text-center font-semibold border-b border-r border-gray-600 font-serif sticky top-0 bg-gray-700 z-20">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usersData.map((item, index) => (
              <tr key={item.id} className="bg-gray-800">
                <td className="border-b py-2 border-r border-gray-700 text-center">{(currentpage - 1) * limit + index + 1}</td>
                <td className="border-b border-r border-gray-700 text-center">{item.fullName}</td>
                <td className="border-b border-r border-gray-700 text-center">{item.email}</td>
                <td className="border-b border-r border-gray-700 text-center">{item.phoneNumber}</td>
                <td className="border-b border-r border-gray-700 text-center">{item.companyName}</td>
                <td className="border-b border-gray-700 text-center">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => handleSetPermissionClick(item.id)}
                      className="text-green-500 hover:text-green-800"
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

        {/* Pagination */}
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

        {/* Permission Modal */}
        {permissionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white text-black p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-lg font-semibold mb-4">Set Permissions</h3>
              <div className="space-y-3 mb-4">
                {Object.keys(permissions).map((key) => (
                  <div key={key} className="flex justify-between items-center">
                    <label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      type="checkbox"
                      checked={permissions[key]}
                      onChange={() => setPermissions(prev => ({ ...prev, [key]: !prev[key] }))}
                    />
                  </div>
                ))} 
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setPermissionModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSetPermissions}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubAdminPreferences;
