import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';


const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [currentpage, setCurrentpage] = useState(1);
  const limit = 11

  useEffect(() => {
    fetchUsers();
  }, [currentpage]);


  function fetchUsers() {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(`http://16.171.60.57:3001/v1/admin/fetchUserList?page=${currentpage}&limit=${limit}&userType=user`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success == true) {
          console.log(result.UserList);
          setUsersData(result.UserList.results)
          setUserCount(result.UserList.totalResults)
        }
      })
      .catch((error) => console.error(error));
  }

  // Fetch users and companies data



  const npage = Math.ceil(userCount / limit);
  const numbers = [...Array(npage + 1).keys()].slice(1);


  const goToPrevPage = () => {
    if (currentpage > 1) setCurrentpage(currentpage - 1);
  };

  const goToNextPage = () => {
    if (currentpage < npage) setCurrentpage(currentpage + 1);
  };

  return (
    <div className="flex h-screen overflow-auto">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-900 ml-64">
        <div style={{}}>
          <div className="flex items-center space-x-4bg-gray-100 rounded-lg shadow-lg mb-3">
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
          <div className=" bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left border-b">Name</th>
                  <th className="px-4 py-2 text-left border-b">Email</th>
                  <th className="px-4 py-2 text-left border-b">Mobile Number</th>
                  <th className="px-4 py-2 text-left border-b">Company Name</th>
                  <th className="px-4 py-2 text-center border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  usersData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2 border-b">{item.fullName}</td>
                      <td className="px-4 py-2 border-b">{item.email}</td>
                      <td className="px-4 py-2 border-b">{item.phoneNumber}</td>
                      <td className="px-4 py-2 border-b">{item.companyName}</td>
                      <td className="px-4 py-2 border-b text-center">
                        <button
                          data-bs-toggle="modal" data-bs-target="#exampleModal"
                          onClick={() => { }}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

          {/* Pagination */}

          <div className="s-cus-pagintion custompaginationtoprightbox" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className={`page-item ${currentpage === 1 ? 'disabled' : ''}`}><a onClick={goToPrevPage} className="page-link" aria-label="Previous"><span aria-hidden="true">«</span></a>
                </li>{numbers.map((num) => (<li className={`page-item `}><span style={{ backgroundColor: currentpage === num ? '#00b6f0' : 'white', color: currentpage === num ? 'white' : 'black' }} className="page-link" onClick={() => setCurrentpage(num)}> {num} </span> </li>))}
                <li className={`page-item ${currentpage === npage ? 'disabled' : ''}`}><a onClick={goToNextPage} className="page-link" aria-label="Next"> <span aria-hidden="true">»</span>
                </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* confirm modal */}

          <div class="modal" id="exampleModal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Delete User</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <p>Are you sure you want to Delete this User ?</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Delete</button>
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
