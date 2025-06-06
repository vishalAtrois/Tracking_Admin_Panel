import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [token, setToken] = useState('');
  const [si, setSi] = useState('');
  const [loading, setLoading] = useState(true);
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
  const [currentpage, setCurrentpage] = useState(1);
  const limit = 20;
 


  // State
const [editedUser, setEditedUser] = useState({
  id: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  companyName: ''
});
const [showEditModal, setShowEditModal] = useState(false);
 const [showDeleteModal, setShowDeleteModal] = useState(false);
// Trigger edit
const handleEditClick = (user) => {
  setEditedUser({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    companyName: user.companyName
  });
  setShowEditModal(true);
};

// Handle input change
const handleEditChange = (e) => {
  const { name, value } = e.target;
  setEditedUser((prev) => ({
    ...prev,
    [name]: value
  }));
};

// Save updated user
const saveEditedUser = async () => {
  const token = localStorage.getItem('token');
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const { id, ...userData } = editedUser;

  try {
    const response = await fetch(`https://tracking-backend-admin.vercel.app/v1/admin/updateUser?userId=${id}`, {
      method: 'PUT', 
      headers: myHeaders,
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    if (result.success) {
      alert("User updated successfully");
      setShowEditModal(false);
      fetchUsers();
      console.log(result, "editing user ")
    } else {
      alert("Update failed: " + result.message);
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred.");
  }
};
    //  fetching data 
  useEffect(() => {
    fetchUsers();
  },[currentpage,searchQuery]);

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

  function DeleteUser() {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`https://tracking-backend-admin.vercel.app/v1/admin/deleteUser?userId=${si}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        if (result.success === true) {
          setShowDeleteModal(false)
          fetchUsers();
        }
        console.log(result, "delete user")
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
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

  function handleDeleteClick(item){
    setShowDeleteModal(true)
    setSi(item.id)
}


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
    <button
      title="Search"
      className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-white w-full sm:w-auto mt-1"
      onClick={fetchUsers}
    >
      Search
    </button>
  </div>

  {/* Scrollable Table Container */}
    <div className="rounded-xl overflow-x-auto shadow-lg border border-gray-700 max-w-full">
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full animate-spin-slow opacity-30"></div>
          </div>
          <p className="mt-4 text-blue-400 text-lg animate-pulse">Loading user...</p>
        </div>
      ) : (
        <table className="min-w-full table-auto bg-gray-900 text-white text-sm">
          <thead className="bg-gray-700">
            <tr>
              {['Sr.no', 'Name', 'Email', 'Mobile Number', 'Company Name', 'Actions'].map((heading) => (
                <th key={heading} className="py-1 text-center font-semibold border-b border-r border-gray-600 font-serif sticky top-0 bg-gray-700 z-20">
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
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-2 rounded-full hover:bg-blue-100 text-blue-500 hover:text-blue-800 transition"
                      title="Edit User"
                    >
                      <i className="bi bi-pencil-fill text-lg"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="p-2 rounded-full hover:bg-red-100 text-red-500 hover:text-red-800 transition"
                      title="Delete User"
                    >
                      <i className="bi bi-trash-fill text-lg"></i>
                    </button>
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

  {/* Edit Prompt */}
  {showEditModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-lg mx-4">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <input
          name="fullName"
          value={editedUser.fullName}
          onChange={handleEditChange}
          placeholder="Full Name"
          className="w-full mb-2 p-2 border rounded text-sm sm:text-base"
        />
        <div className="relative w-full mb-2">
          <input
            name="email"
            value={editedUser.email}
            disabled
            placeholder="email"
            className="w-full p-2 pr-10 border rounded bg-gray-100 text-gray-700"
          />
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="red"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 5.636A9 9 0 015.636 18.364 9 9 0 0118.364 5.636zm-12.728 12.728L18.364 5.636"
              />
            </svg>
          </div>
        </div>

        <div className="relative w-full mb-2">
          <input
            name="phoneNumber"
            value={editedUser.phoneNumber}
            disabled
            placeholder="Phone Number"
            className="w-full p-2 pr-10 border rounded bg-gray-100 text-gray-700"
          />
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="red"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 5.636A9 9 0 015.636 18.364 9 9 0 0118.364 5.636zm-12.728 12.728L18.364 5.636"
              />
            </svg>
          </div>
        </div>
        <input
          name="companyName"
          value={editedUser.companyName}
          onChange={handleEditChange}
          placeholder="Company Name"
          className="w-full mb-4 p-2 border rounded text-sm sm:text-base"
        />
        <div className="flex justify-end gap-4">
          <button onClick={saveEditedUser} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base">Save</button>
          <button onClick={() => setShowEditModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 text-sm sm:text-base">Cancel</button>
        </div>
      </div>
    </div>
  )}

  {/* Confirm Delete Modal */}
  {showDeleteModal && (
    <div className="fixed inset-1 bg-black bg-opacity-75 flex items-start justify-center z-50 pt-20">
      <div className="bg-white rounded-lg p-6 w-128 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to Delete?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 transition text-white text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={() => DeleteUser()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm sm:text-base"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )}

</div>

  </div>

  
  
  );
};

export default Users;
