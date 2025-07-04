import React, { useEffect, useState } from 'react';
import Subsidebar from './Subsidebar';



const SubNotificationUser = () => {
  const [usersData, setUsersData] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentpage, setCurrentpage] = useState(1);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const limit = 20;

  const fetchUsers = () => {
    const token = localStorage.getItem('token');
    setToken(token);
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
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
  };

  useEffect(() => {
    fetchUsers();
  }, [currentpage, searchQuery]);

  const sendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Title and message are required");
      return;
    }

    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      senderId: storedUser.id,
      receiverId: selectedUser.id,
      senderUserType: "subAdmin",
      receiverUserType: "User",
      title,
      message,
      notificationType: "notification",
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch("https://tracking-backend-admin.vercel.app/v1/common/sendNotificationAdmin", requestOptions);
      const result = await response.json();
      if (result.success) {
        alert("Notification sent successfully");
        setShowPrompt(false);
        setTitle("");
        setMessage("");
      } else {
        alert("Failed to send notification: " + result.message);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("An error occurred while sending the notification.");
    }
  };

  const npage = Math.ceil(userCount / limit);
  const pageNumbers = [];
  if (npage <= 4) {
    for (let i = 1; i <= npage; i++) pageNumbers.push(i);
  } else {
    if (currentpage <= 2) pageNumbers.push(1, 2, 3, '...', npage);
    else if (currentpage >= npage - 1) pageNumbers.push(1, '...', npage - 2, npage - 1, npage);
    else pageNumbers.push(currentpage - 1, currentpage, currentpage + 1, '...', npage);
  }

  const goToPrevPage = () => currentpage > 1 && setCurrentpage(currentpage - 1);
  const goToNextPage = () => currentpage < npage && setCurrentpage(currentpage + 1);
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900  overflow-x-hidden">
      {/* Sidebar Button */}
      <div className="md:hidden p-4 bg-gray-800 shadow-md z-50 flex items-center justify-start gap-4 sticky top-0.5">
        <button onClick={() => setSidebarOpen(true)} className="text-white focus:outline-none">
          <i className="bi bi-list text-3xl"></i>
        </button>
        <h2 className="text-white text-xl font-semibold">Tracking App</h2>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed md:relative z-50 transform top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out bg-gray-800 shadow-lg ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <Subsidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-3 flex flex-col overflow-y-auto max-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 bg-gray-800 rounded-xl p-2 shadow-lg sticky top-[3.75rem] z-20 mb-2">
          <input
            className="p-2 rounded-md border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 mb-2 sm:mb-0 mt-2"
            placeholder="Search Employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                    <td className="border-b border-gray-700 text-center">
                      <button
                        onClick={() => {
                          setSelectedUser(item);
                          setShowPrompt(true);
                        }}
                        className="p-2 rounded-full hover:bg-green-100 text-green-500 hover:text-green-800 transition"
                        title="Send Notification"
                      >
                        <i className="fa fa-paper-plane text-lg"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
          {showPrompt && selectedUser && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-95 text-white p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">📢 Notify {selectedUser.fullName}</h2>
              <button
                onClick={() => {
                  setShowPrompt(false);
                  setTitle('');
                  setMessage('');
                }}
                className="text-white hover:text-red-400"
              >
                <i className="bi bi-x-lg text-2xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Title</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter notification title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Message</label>
                <textarea
                  rows={5}
                  className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white resize-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowPrompt(false)}
                className="px-5 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={sendNotification}
                className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              >
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}
    

        <div className="custom-pagination-container flex justify-center mt-2">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className={`page-item ${currentpage === 1 ? 'disabled' : ''}`}>
                <span onClick={goToPrevPage} className="page-link cursor-pointer">«</span>
              </li>
              {pageNumbers.map((num, index) => (
                <li className={`page-item ${num === currentpage ? 'active' : ''}`} key={index}>
                  {num === '...' ? (
                    <span className="page-link">...</span>
                  ) : (
                    <span
                      onClick={() => setCurrentpage(num)}
                      className="page-link cursor-pointer"
                      style={{ backgroundColor: currentpage === num ? '#00b6f0' : 'white', color: currentpage === num ? 'white' : 'black' }}
                    >
                      {num}
                    </span>
                  )}
                </li>
              ))}
              <li className={`page-item ${currentpage === npage ? 'disabled' : ''}`}>
                <span onClick={goToNextPage} className="page-link cursor-pointer">»</span>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SubNotificationUser;