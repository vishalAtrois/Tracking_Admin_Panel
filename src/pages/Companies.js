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
  const limit = 10;

   

  // State for editing company
  const [editedCompany, setEditedCompany] = useState({
    id: '',
    name: '',
    address: '',
    totalEmployees: '',
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
          setShowDeleteModal(false)
          fetchCompany();
          console.log(result, "deleting company ");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  }

  // Logic part
const npage = Math.ceil(companyCount / limit);
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


  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

 
 function handleDeleteClick(item){
    setShowDeleteModal(true)
    setSi(item.id)
}


  return (<div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900">
  <Sidebar />
  <div className="flex-1 p-6 bg-gray-900 ml-64">
    <div className="h-full overflow-y-auto pr-2">
      {/* Search Box */}
      <div className="flex items-center space-x-4 bg-gray-900 rounded-lg shadow-lg mb-3 sticky -top-1 ">
        <input
          className="form-control p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
          id="exampleData"
          placeholder="Search Company ...."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button
          title="Search"
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out mt-2"
          onClick={fetchCompany}
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
              <tr className='transition-all duration-300 bg-gray-700 border-none text-white'>
                <th className="py-1 text-center border-b border-r border-black    font-serif">Sr.no</th>
                <th className="py-1 text-center border-b border-r border-black   font-serif">Name</th>
                <th className="py-1 text-center border-b border-r border-black    font-serif">Address</th>
                <th className="py-1 text-center border-b border-r border-black    font-serif">Total Employees</th>
                <th className="py-1 text-center border-b border-r border-black    font-serif">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (        
                 <tr key={index} className="bg-white">
                  <td className=" border-b border-r border-black text-center font-serif">{(currentpage - 1) * limit + index + 1}</td>
                  <td className=" border-b border-r border-black text-center font-serif">{item.name}</td>
                  <td className=" border-b border-r border-black text-center font-serif">{item.address}</td>
                  <td className=" border-b border-r border-black text-center font-serif">{item.totalEmployees}</td>
                  <td className=" border-b border-r border-black text-center font-serif">
                    <div className="flex justify-center gap-4">
                      <button
                        className="p-2 rounded-full hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition"
                        title="Edit"
                        onClick={() => { handleEditClick(item) }}
                      >
                        <i className="bi bi-pencil-fill text-lg"></i>
                      </button>
                      <button
                        onClick={() => {handleDeleteClick(item)}}
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

      {/* Pagination UI */}
      <div className="s-cus-pagintion custompaginationtoprightbox" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', position: 'sticky', bottom: '0px' }}>
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className={`page-item ${currentpage === 1 ? 'disabled' : ''}`}>
              <a onClick={goToPrevPage} className="page-link" style={{ cursor: 'pointer' }} aria-label="Previous">
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
              <a onClick={goToNextPage} className="page-link" style={{ cursor: 'pointer' }} aria-label="Next">
                <span aria-hidden="true">»</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Edit Company Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-128">
            <h2 className="text-xl font-bold mb-4">Edit Company</h2>
            <div className="relative w-full mb-2">
              <input
                name="phoneNumber"
                value={editedCompany.name}
                disabled
                placeholder="Phone Number"
                className="w-full p-2 pr-10 border rounded bg-gray-100 text-gray-700"
              />
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="red" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636A9 9 0 015.636 18.364 9 9 0 0118.364 5.636zm-12.728 12.728L18.364 5.636" />
                </svg>
              </div>
            </div>
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

      {/* Confirm Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-1 bg-black bg-opacity-75 flex items-start justify-center z-50 pt-20">
          <div className="bg-white rounded-lg p-6 w-128 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to Delete?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 transition text-white"
              >
                Cancel
              </button>
              <button
                onClick={()=>Delete()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
</div>
  );
};

export default Companies;
