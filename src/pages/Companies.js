import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const Companies = () => {
  const [data, setData] = useState([]);
  const [companyCount, setCompanyCount] = useState(0);
  const [currentpage, setCurrentpage] = useState(1);
  const [token, setToken] = useState('');
  const [si, setSi] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');  
  const limit = 8;

   

  // State for editing company
  const [editedCompany, setEditedCompany] = useState({
    id: '',
    name: '',
    address: '',
    totalEmployees: '',
  });
  const [showEditModal, setShowEditModal] = useState(false);

  // Trigger edit
  const handleEditClick = (company) => {
    setEditedCompany({
      id: company.id,
      name: company.name,
      address: company.address,
      totalEmployees: company.totalEmployees,
    });
    setShowEditModal(true);
  };

  // Handle input change for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save updated company
  const saveEditedCompany = async () => {
    const token = localStorage.getItem('token');
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    const { id, ...data } = editedCompany;

    try {
      const response = await fetch(`https://tracking-backend-admin.vercel.app/v1/admin/updateCompany?companyId=${id}`, {
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        alert("Company updated successfully");
        setShowEditModal(false);
        fetchCompany();
        console.log(result, "company edit");
      } else {
        alert("Update failed: " + result.message);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    }
  };

  // Fetch companies (with or without search query)
  function fetchCompany() {
    const token = localStorage.getItem('token');
    const myHeaders = new Headers();
    setToken(token);
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    // If there's a search query, search for companies, else fetch all companies
    const url = searchQuery
      ? `https://tracking-backend-admin.vercel.app/v1/admin/searchCompany?query=${searchQuery}&page=${currentpage}&limit=${limit}`
      : `https://tracking-backend-admin.vercel.app/v1/admin/fetchCompanyList?page=${currentpage}&limit=${limit}&sortBy=createdAt:desc`;
      fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success === true) {
          if (searchQuery) {
            console.log("Search API response:", result);
            setData(result.searchedCompany.data); // <-- correct field for search
            setCompanyCount(result.searchedCompany.totalResults);
            setLoading(false)
          } else {
            console.log("Fetch Company List response:", result);
            setData(result.UserList.results); // <-- correct field for paginated list
            setCompanyCount(result.UserList.totalResults);
            setLoading(false)
          }
        }
      })
      .catch((error) => console.error(error));
    
  }

  useEffect(() => {
    fetchCompany();
  }, [currentpage, searchQuery]); // Added searchQuery dependency to trigger fetching on search change

  // Delete company function
  function Delete() {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`https://tracking-backend-admin.vercel.app/v1/admin/deleteCompany?companyId=${si}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        if (result.success === true) {
          fetchCompany();
          console.log(result, "deleting company ");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }

  const npage = Math.ceil(companyCount / limit);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const goToPrevPage = () => {
    if (currentpage > 1) setCurrentpage(currentpage - 1);
  };

  const goToNextPage = () => {
    if (currentpage < npage) setCurrentpage(currentpage + 1);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-900 ml-64">
        <div className="h-full overflow-y-auto pr-2">
          {/* Search Box */}
          <div className="flex items-center space-x-4 bg-gray-900 rounded-lg shadow-lg mb-3 sticky -top-1">
            <input
              className="form-control p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 m-2"
              id="exampleData"
              placeholder="Search Company ...."
              value={searchQuery}
              onChange={handleSearchChange} // Update the search query on input change
            />
            <button
              title="Search"
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
              onClick={fetchCompany} // Trigger search on button click
            >
              Search
            </button>
          </div>

          {/* Table with Company Data */}
          <div className="rounded-lg shadow-md overflow-x-auto w-full">
          {loading ? (
    <div className="flex flex-col justify-center items-center py-20 text-white">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full animate-spin-slow opacity-30"></div>
    </div>
    <p className="mt-4 text-blue-400 text-lg animate-pulse">Loading Companies...</p>
  </div>
) : (
            <table className="min-w-full table-auto border border-gray-200">
              <thead className="bg-gray-200 text-gray-700">
                <tr className='transition-all duration-300 ease-in bg-gray-500 hover:bg-gray-700 border-none text-white'>
                  <th className="px-2 py-2 text-center border-b border-r border-black text-sm md:text-lg lg:text-xl font-serif">Sr.no</th>
                  <th className="px-2 py-2 text-center border-b border-r border-black text-sm md:text-lg lg:text-xl font-serif">Name</th>
                  <th className="px-2 py-2 text-center border-b border-r border-black text-sm md:text-lg lg:text-xl font-serif">Address</th>
                  <th className="px-2 py-2 text-center border-b border-r border-black text-sm md:text-lg lg:text-xl font-serif">Total Employees</th>
                  <th className="px-2 py-2 text-center border-b border-r border-black text-sm md:text-lg lg:text-xl font-serif">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="bg-white">
                    <td className="px-4 py-2 border-b border-r border-black text-center text-lg font-serif">{(currentpage - 1) * limit + index + 1}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-center text-lg font-serif">{item.name}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-center text-lg font-serif">{item.address}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-center text-lg font-serif">{item.totalEmployees}</td>
                    <td className="px-4 py-2 border-b border-r border-black text-center text-lg font-serif">
                      <div className="flex justify-center gap-4">
                        {/* Edit Button */}
                        <button
                          className="p-2 rounded-full hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition"
                          title="Edit"
                          onClick={() => { handleEditClick(item) }}
                        >
                          <i className="bi bi-pencil-fill text-lg"></i>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => { setSi(item.id) }}
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
)}
          </div>

          {/* Pagination */}
          <div className="s-cus-pagintion custompaginationtoprightbox" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', position: "sticky", bottom: "0px" }}>
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className={`page-item ${currentpage === 1 ? 'disabled' : ''}`}><a onClick={goToPrevPage} className="page-link" aria-label="Previous"><span aria-hidden="true">«</span></a></li>
                {numbers.map((num) => (
                  <li className={`page-item`}>
                    <span style={{ backgroundColor: currentpage === num ? '#00b6f0' : 'white', color: currentpage === num ? 'white' : 'black' }} className="page-link" onClick={() => setCurrentpage(num)}>
                      {num}
                    </span>
                  </li>
                ))}
                <li className={`page-item ${currentpage === npage ? 'disabled' : ''}`}><a onClick={goToNextPage} className="page-link" aria-label="Next"><span aria-hidden="true">»</span></a></li>
              </ul>
            </nav>
          </div>

          {/* Edit Company Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Company</h2>
                <input
                  name="name"
                  value={editedCompany.name}
                  onChange={handleEditChange}
                  placeholder="name"
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  name="address"
                  value={editedCompany.address}
                  onChange={handleEditChange}
                  placeholder="address"
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  name="totalEmployees"
                  value={editedCompany.totalEmployees}
                  onChange={handleEditChange}
                  placeholder="total employees"
                  className="w-full mb-2 p-2 border rounded"
                />
                <div className="flex justify-end gap-4">
                  <button onClick={saveEditedCompany} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                  <button onClick={() => setShowEditModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
                </div>
              </div>
            </div>
          )}
          
          {/* Confirm Modal */}
          <div class="modal" id="exampleModal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Delete Company</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <p>Are you sure you want to Delete this Company?</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button className="btn btn-danger" data-bs-dismiss="modal" onClick={() => Delete()}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
         </div>
    </div>
  );
};

export default Companies;
