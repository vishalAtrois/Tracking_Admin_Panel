import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [token, setToken] = useState('');
  const [si, setSi] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentpage, setCurrentpage] = useState(1);
  const limit = 9;

  useEffect(() => {
    fetchUsers();
  }, [currentpage]);

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

    fetch(`https://tracking-backend-admin.vercel.app/v1/admin/fetchUserList?page=${currentpage}&limit=${limit}&sortBy=createdAt:desc`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success === true) {
          setUsersData(result.UserList.results);
          setUserCount(result.UserList.totalResults);
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

    fetch(`http://16.171.60.57:3001/v1/admin/deleteUser?userId=${si}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        if (result.success === true) {
          fetchUsers();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }

  const npage = Math.ceil(userCount / limit);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const goToPrevPage = () => {
    if (currentpage > 1) setCurrentpage(currentpage - 1);
  };

  const goToNextPage = () => {
    if (currentpage < npage) setCurrentpage(currentpage + 1);
  };

  return (
    <div className="flex h-screen overflow-auto bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-900 ml-64">
        <div className="h-full overflow-y-auto pr-2">
          <div className="flex items-center space-x-4 bg-gray-900 rounded-lg shadow-lg mb-3 sticky -top-1">
            <input
              className="form-control p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 m-2"
              id="exampleData"
              placeholder="Search User ...."
            />
            <button
              title="Search"
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
              onClick={() => console.log("Search button clicked")}
            >
              Search
            </button>
          </div>

          <div className="rounded-lg shadow-md overflow-x-auto w-full">
            <table className="min-w-full table-auto border border-gray-200">
              <thead className="bg-gray-200 text-gray-700">
                <tr className="transition-all duration-300 ease-in bg-gray-500 hover:bg-gray-700 text-white">
                  <th className="px-2 py-2 text-center border-b border-r border-black text-sm md:text-lg lg:text-xl font-serif">Name</th>
                  <th className="px-2 py-2 text-center border-b border-r border-black text-sm md:text-lg lg:text-xl font-serif">Email</th>
                  <th className="px-2 py-2 text-center border-b border-r border-black text-sm md:text-lg lg:text-xl font-serif">Mobile Number</th>
                  <th className="px-2 py-2 text-center border-b border-r border-black text-sm md:text-lg lg:text-xl font-serif hidden sm:table-cell">Company Name</th>
                  <th className="px-2 py-2 text-center border-b border-r border-black text-sm md:text-lg lg:text-xl font-serif">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersData.map((item) => (
                  <tr key={item.id} className="bg-white">
                    <td className="px-4 py-2 border-b border-r border-black text-center text-lg font-serif">{item.fullName}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-center text-lg font-serif">{item.email}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-center text-lg font-serif">{item.phoneNumber}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-center text-lg font-serif">{item.companyName}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-center">
                      <div className="flex justify-center gap-4">
                        {/* Edit Button */}
                        <button
                          onClick={() =>""}
                          className="p-2 rounded-full hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition"
                          title="Edit"
                        >
                          <i className="bi bi-pencil-fill text-lg"></i>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => { setSi(item.id); }}
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          className="p-2 rounded-full hover:bg-red-100 text-red-600 hover:text-red-800 transition"
                          title="Delete"
                        >
                          <i className="bi bi-trash-fill text-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="s-cus-pagintion custompaginationtoprightbox" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', position:'sticky', bottom:"0px" }}>
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className={`page-item ${currentpage === 1 ? 'disabled' : ''}`}>
                  <a onClick={goToPrevPage} className="page-link" aria-label="Previous">
                    <span aria-hidden="true">«</span>
                  </a>
                </li>
                {numbers.map((num) => (
                  <li className={`page-item `} key={num}>
                    <span style={{ backgroundColor: currentpage === num ? '#00b6f0' : 'white', color: currentpage === num ? 'white' : 'black' }} className="page-link" onClick={() => setCurrentpage(num)}>
                      {num}
                    </span>
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

          <div className="modal" id="exampleModal" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete User</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to Delete this User?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="button" className="btn btn-danger" onClick={DeleteUser} data-bs-dismiss="modal">Delete</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Users;
