import React, { useEffect, useState } from 'react';
import Subsidebar from './Subsidebar';

const VoiceTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [currentpage, setCurrentpage] = useState(1);
  const [limit] =useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [getIdDate,setGetIdDate] = useState(null)
  const [taskDate,setTaskDate] = useState(null)
  

  
  const fetchTaskByDate = (userId, date) => {
  const token = localStorage.getItem("token");
  if (!token || !userId) {
    console.error("Missing token or userId.");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  fetch(`https://tracking-backend-admin.vercel.app/v1/subAdmin/getReportByDate?userId=${userId}&date=${date}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("userid task", userId);
      console.log("Filtered voicetask:", result);
      console.log("date", date);

      if (result.success && result.reportList) {
        setTasks(result.reportList);
      } else {
        setTasks([]);
      }
    })
    .catch((error) => console.error("API Error:", error));
};



  function fetchUsers() {
    const token = localStorage.getItem('token');
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    const url = searchQuery
      ? `https://tracking-backend-admin.vercel.app/v1/admin/searchUser?query=${searchQuery}&page=${currentpage}&limit=${limit}`
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

  const fetchTasks = (userId) => {
    if (!userId) return;
    const token = localStorage.getItem('token');
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`https://tracking-backend-admin.vercel.app/v1/subAdmin/getTask?userId=${userId.id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
 if (result.success && Array.isArray(result.tasktList)) {
  console.log("tasks response ", result);
  setTasks(result.tasktList);
  setShowTaskModal(true);
}
 else {
          console.error("Unexpected task API response format:", result);
        }
      })
      .catch((error) => console.error("Fetch error:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [currentpage, searchQuery]);

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
          <button
            title="Search"
            className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md text-white w-full sm:w-auto mt-1"
            onClick={fetchUsers}
          >
            Search
          </button>
        </div>

        {/* Table Section */}
        <div className="rounded-xl overflow-x-auto shadow-lg border border-gray-700 max-w-full">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full animate-spin-slow opacity-30"></div>
              </div>
              <p className="mt-4 text-blue-400 text-lg animate-pulse">Loading Employees...</p>
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
                  <tr key={item.id || index} className="bg-gray-800">
                   <td className="border-b border-r border-gray-700 text-center">{(currentpage - 1) * limit + index + 1}</td>
                   <td className="border-b border-r border-gray-700 text-center">{item.fullName}</td>
                    <td className="border-b border-r border-gray-700 text-center">{item.email}</td>
                    <td className="border-b border-r border-gray-700 text-center">{item.phoneNumber}</td>
                    <td className="border-b border-r border-gray-700 text-center">{item.companyName}</td>
                    <td className="border-b border-gray-700 text-center">
                      <div className="flex justify-center gap-4">
                        <button onClick={() => {setGetIdDate(item.id);
                          fetchTasks(item);
                        }
                      } className="p-2 rounded-full hover:bg-green-100 text-green-500 hover:text-green-800 transition" title="View Tasks">
                          <i className="bi bi-list-task text-lg"></i>
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

        {showTaskModal && (
          <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-60 overflow-y-auto p-4">
            <div className="bg-gray-900 max-w-4xl mx-auto mt-10 p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-xl font-bold">Tasks</h2>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="bi bi-x-lg text-2xl"></i>
                </button>
              </div>
  <input
  type="date"
  value={taskDate || ""}
  onChange={(e) => {
  const selectedDate = e.target.value;
  setTaskDate(selectedDate);

  if (selectedDate) {
    fetchTaskByDate(getIdDate, selectedDate); // ✅ Explicitly pass latest userId
  } else {
    fetchTasks({ id: getIdDate });
  }
}}
  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
/>


              {tasks.length === 0 ? (
                <p className="text-gray-400">No tasks found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tasks.map((task) => (
                    <div key={task._id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <h3 className="text-purple-300 font-bold text-lg mb-2">{task.title}</h3>
                      <p className="text-sm text-gray-300 mb-1">
                        <strong>Description:</strong> {task.description || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-300 mb-1">
                        <strong>Status:</strong> {task.status}
                      </p>
                      <p className="text-sm text-gray-300 mb-1">
                        <strong>Time:</strong> {task.startWorkingHour} - {task.endWorkingHour}
                      </p>
                      <p className="text-sm text-gray-300 mb-1">
                        <strong>Duration:</strong> {task.durationOfTask}
                      </p>
                      <p className="text-sm text-gray-300 mb-1">
                        <strong>Date:</strong> {new Date(task.taskDate).toLocaleDateString()}
                      </p>
                      {task.file?.url && (
                        <audio controls className="w-full mt-2">
                          <source src={task.file.url} type={task.file.type || 'audio/mpeg'} />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceTasks;
