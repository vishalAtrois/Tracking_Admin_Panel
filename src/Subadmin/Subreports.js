 import React, { useEffect, useState } from 'react';
import Subsidebar from './Subsidebar';
 
 
 const Subreports = () => {
   const [usersData, setUsersData] = useState([]);
   const [userCount, setUserCount] = useState(0);
   const [token, setToken] = useState('');
   const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
   const [currentpage, setCurrentpage] = useState(1);
   const limit = 20;
   const [selectedUserReports, setSelectedUserReports] = useState([]);
const [reportModalOpen, setReportModalOpen] = useState(false);
const [selectedCompany, setSelectedCompany] = useState(null);  // stores selected company name
const [companyReports, setCompanyReports] = useState([]);      // stores detailed reports of selected company
const [loadingReports, setLoadingReports] = useState(false);   // loading indicator for reports fetch
const [showAddReportModal, setShowAddReportModal] = useState(false);
const [newReportFile, setNewReportFile] = useState(null);
const [newReportImages, setNewReportImages] = useState([]);
const [userId,setUserId] = useState('')
const [selectedUser, setSelectedUser] = useState(null);
const [extraFields, setExtraFields] = useState([{ key: "", value: "" }]);

const handleExtraFieldChange = (index, field, value) => {
  const updatedFields = [...extraFields];
  updatedFields[index][field] = value;
  setExtraFields(updatedFields);
};

const addExtraField = () => {
  setExtraFields([...extraFields, { key: "", value: "" }]);
};



const handleImageChange = (e) => {
  const files = Array.from(e.target.files);

  if (files.length > 5) {
    alert("You can upload up to 5 images only.");
    return;
  }

  if (files.length < 1) {
    alert("Please select at least 1 image.");
    return;
  }

  setNewReportImages(files);
};
const [newReport, setNewReport] = useState({
  companyName: '',
  address: '',
  businessSize: '',
  reportTime: '',
  reportDate: '',
  notes: '',
  title:'',
});




const AddReport = async (id, reportData, file, images, extraFields) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();

  // Add base fields
  formData.append("title", reportData.title);
  formData.append("companyName", reportData.companyName);
  formData.append("address", reportData.address);
  formData.append("businessSize", reportData.businessSize);
  formData.append("reportTime", reportData.reportTime?.slice(0, 5));
  formData.append("reportDate", reportData.reportDate);
  formData.append("notes", reportData.notes);

  // Add file if present
  if (file) {
    formData.append("file", file);
  }

  // Add images
  images.forEach((img) => {
    formData.append("images", img);
  });

  // ✅ Add extra fields (excluding empty keys or values)
  extraFields.forEach(({ key, value }) => {
    if (key && value) {
      formData.append(key, value);
    }
  });

  try {
    const response = await fetch(
      `https://tracking-backend-admin.vercel.app/v1/subAdmin/createReport?userId=${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const resultText = await response.text();
    let result;

    try {
      result = JSON.parse(resultText);
    } catch (e) {
      console.error("❌ Failed to parse JSON:", e);
      alert("Server error: Invalid response format");
      return;
    }

    if (result.success) {
      alert("✅ Report created successfully");
    } else {
      alert("❌ Failed to create report");
    }
  } catch (error) {
    alert("❌ Network or fetch error");
    console.error("❌ Fetch error:", error);
  }
};



const handleCreateReport = async () => {
  console.log("🛠️ Creating report with the following data:");
  console.log("🧾 Report Data:", newReport);
  console.log("📎 Selected File:", newReportFile);
  console.log("🖼️ Selected Images:", newReportImages);
  console.log("👤 Selected User:", selectedUser);

  if (newReportImages.length < 1) {
    alert("Please upload at least one image.");
    return;
  }

  if (newReportImages.length > 5) {
    alert("You can upload a maximum of 5 images.");
    return;
  }

  if (!selectedUser) {
    alert("No user selected.");
    return;
  }

  await AddReport(selectedUser.id, newReport, newReportFile, newReportImages,extraFields);

  // Reset form and state after success
  setShowAddReportModal(false);
  setNewReport({
    companyName: '',
    address: '',
    businessSize: '',
    reportTime: '',
    reportDate: '',
    notes: '',
    title: '',
  });
  setNewReportFile(null);
  setNewReportImages([]);
  setExtraFields([{ key: "", value: "" }]);
};

 

  
 
const fetchUserReport = async (item) => {
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
setUserId(item)
  try {
    const response = await fetch(
      `https://tracking-backend-admin.vercel.app/v1/subAdmin/getReportsByUser?userId=${userId.id}`,
      {
        method: "GET",
        headers,
        redirect: "follow"
      }
    );
    const result = await response.json();
    if (result.success && result.reportList) {
      setSelectedUserReports(result.reportList);
      setReportModalOpen(true);
    } else {
      console.error("Invalid response", result);
    }
  } catch (error) {
    console.error("Error fetching report:", error);
  }
};


 
 
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
     :`https://tracking-backend-admin.vercel.app/v1/subAdmin/fetchUserList?page=${currentpage}&limit=${limit}&sortBy=created:desc`
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
 
     //  fetching data 
     useEffect(() => {
       fetchUsers();
     },[currentpage,searchQuery]);
  
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
         placeholder="Search employee..."
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
               {['Sr.no', 'Name', 'Email', 'Mobile Number', 'Company Name', 'Reports'].map((heading) => (
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
                          onClick={() =>  fetchUserReport(item)}
                          className="p-2 rounded-full hover:bg-blue-100 text-blue-500 hover:text-blue-800 transition"
                          title="Reports"
                        >
                          <i className="fa fa-clipboard text-lg"></i>
                        </button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       )}
     </div>







 
   
 
{/* addreport modal */}
{showAddReportModal && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto p-4">
    <div className="relative max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6">
  
      <h2 className="text-xl font-bold mb-4">Add New Report</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateReport();
        }}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Company Name"
          className="w-full p-2 border rounded"
          value={newReport.companyName}
          onChange={(e) =>
            setNewReport({ ...newReport, companyName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Address"
          className="w-full p-2 border rounded"
          value={newReport.address}
          onChange={(e) =>
            setNewReport({ ...newReport, address: e.target.value })
          }
        />
       <select
  className="w-full p-2 border rounded bg-white text-gray-700"
  value={newReport.businessSize}
  onChange={(e) =>
    setNewReport({ ...newReport, businessSize: e.target.value })
  }
>
  <option value="">Select Business Size</option>
  <option value="Small Business">Small Business</option>
  <option value="Medium Business">Medium Business</option>
  <option value="Large Business">Large Business</option>
</select>
        <input
          type="time"
          className="w-full p-2 border rounded"
          value={newReport.reportTime}
          onChange={(e) =>
            setNewReport({ ...newReport, reportTime: e.target.value })
          }
        />
        <input
  type="text"
  placeholder="Title"
  className="w-full p-2 border rounded"
  value={newReport.title}
  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
/>
<div className="w-full">
  <label className="block mb-1 text-sm font-medium text-gray-700">
    Upload Report File (.pdf, .doc, .docx)
  </label>
  <div className="relative">
    <input
      type="file"
      accept=".pdf,.doc,.docx"
      id="reportFileInput"
      onChange={(e) => setNewReportFile(e.target.files[0])}
      className="hidden"
    />
    <label
      htmlFor="reportFileInput"
      className="flex items-center justify-between px-4 py-2 bg-white border rounded cursor-pointer hover:bg-gray-100 transition"
    >
      <span className="text-gray-700">
        {newReportFile ? newReportFile.name : 'Choose File'}
      </span>
      <svg
        className="w-5 h-5 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16V4H4zm4 8h8M8 8h8m-8 8h8" />
      </svg>
    </label>
  </div>
</div>


<input
  type="file"
    className="w-full p-2 border rounded"
  accept="image/*"
  multiple
  onChange={handleImageChange}
/>
       <input
  type="text"
  placeholder="YYYY-MM-DD"
  className="w-full p-2 border rounded"
  value={newReport.reportDate}
  onChange={(e) =>
    setNewReport({ ...newReport, reportDate: e.target.value })
  }
/>

        <textarea
          placeholder="Notes"
          className="w-full p-2 border rounded"
          value={newReport.notes}
          onChange={(e) =>
            setNewReport({ ...newReport, notes: e.target.value })
          }
        />
         {/* Extra Fields */}
        <div className="space-y-2">
          <h3 className="font-semibold">Additional Fields</h3>
          {extraFields.map((field, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Field Name"
                className="w-1/2 p-2 border rounded"
                value={field.key}
                onChange={(e) => handleExtraFieldChange(index, "key", e.target.value)}
              />
              <input
                type="text"
                placeholder="Field Value"
                className="w-1/2 p-2 border rounded"
                value={field.value}
                onChange={(e) => handleExtraFieldChange(index, "value", e.target.value)}
              />
            </div>
          ))}
          <button type="button"
            onClick={addExtraField}
            className="text-blue-600 hover:underline text-sm mt-1"
          >
            + Add More Fields
          </button>
        </div>


        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowAddReportModal(false)}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
)}




{reportModalOpen && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto p-4">
    <div className="relative w-full max-w-6xl mx-auto bg-white rounded-xl shadow-xl border p-4 sm:p-6">

      {/* Header with Title, Add Button and Close Button */}
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
        <h3 className="text-xl font-bold text-gray-800">
          {selectedCompany ? `Reports for ${selectedCompany}` : "User Report List"}
        </h3>

        <div className="flex items-center gap-4">
          {/* Add Report Button */}
          <button
            onClick={() => {
              setSelectedUser(userId);
              setReportModalOpen(false);
              setShowAddReportModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + Add Report
          </button>

          {/* Close Button */}
          <button
            className="text-red-500 text-3xl font-bold"
            onClick={() => {
              setReportModalOpen(false);
              setSelectedCompany(null);
              setCompanyReports([]);
            }}
            title="Close"
          >
            &times;
          </button>
        </div>
      </div>


      {/* Content */}
      {!selectedCompany ? (
        selectedUserReports.length === 0 ? (
          <p className="text-gray-600 text-center">No reports found.</p>
        ) : (
          // Scrollable container only for buttons list
          <div
            className="space-y-2 overflow-y-auto pr-2"
            style={{ maxHeight: 'calc(90vh - 4rem)' }} // subtract header height approx
          >
            {selectedUserReports.map((report) => {
              const latestDate = new Date(report.reportDate).toLocaleDateString();
              return (
                <button
                  key={report._id}
                  className="w-full text-left p-3 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300"
                  onClick={() => {
                    setSelectedCompany(report.companyName);
                    setLoadingReports(true);
                    setCompanyReports([report]);
                    setLoadingReports(false);
                  }}
                >
                  <p className="font-semibold text-gray-800">{report.companyName}</p>
                  <p className="text-sm text-gray-600">Report: {latestDate}</p>
                </button>
              );
            })}


          </div>
        )
      ) : (
        // Step 2: Show detailed reports for selected company
        loadingReports ? (
          <p className="text-center text-gray-600">Loading reports...</p>
        ) : companyReports.length === 0 ? (
          <p className="text-gray-600 text-center">No reports found for this company.</p>
        ) : (
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
            <button
  className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold border border-blue-600 hover:border-blue-800 rounded-md px-3 py-1.5 transition-colors duration-300"
  onClick={() => setSelectedCompany(null)}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
  Back to company list
</button>


           <div className="max-h-[calc(100vh-8rem)] overflow-y-auto px-2 sm:px-4 space-y-4">
{companyReports.map((report, idx) => (
  <div key={report._id} className="border p-3 rounded-lg shadow bg-gray-50 space-y-4">
    
    {/* Title */}
    <div className="text-lg font-bold text-gray-800 border-b pb-1">
      Report {idx + 1}
    </div>

    {/* Company & Address */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {report.companyName && (
        <div className="border px-2 py-2 rounded bg-white">
          <p className="text-sm text-gray-700 font-extrabold">Company</p>
          <p className="text-gray-900">{report.companyName}</p>
        </div>
      )}
      {report.address && (
        <div className="border px-2 py-2 rounded bg-white">
          <p className="text-sm text-gray-700 font-extrabold">Address</p>
          <p className="text-gray-900">{report.address}</p>
        </div>
      )}
    </div>

    {/* Business Size & Report Time */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {report.businessSize && (
        <div className="border rounded px-2 py-2 bg-white">
          <p className="text-sm text-gray-700 font-extrabold">Business Size</p>
          <p className="text-gray-900">{report.businessSize}</p>
        </div>
      )}
      {report.reportTime && (
        <div className="border rounded px-2 py-2 bg-white">
          <p className="text-sm text-gray-700 font-extrabold">Report Time</p>
          <p className="text-gray-900">{report.reportTime}</p>
        </div>
      )}
    </div>

    {/* Report Date & Notes */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {report.reportDate && (
        <div className="border rounded px-2 py-2 bg-white">
          <p className="text-sm text-gray-700 font-extrabold">Report Date</p>
          <p className="text-gray-900">{new Date(report.reportDate).toLocaleDateString()}</p>
        </div>
      )}
      {report.notes && (
        <div className="border rounded px-2 py-2 bg-white">
          <p className="text-sm text-gray-700 font-extrabold">Notes</p>
          <p className="text-gray-900">{report.notes}</p>
        </div>
      )}
    </div>

    {/* Dynamically Added Extra Fields */}
    {Object.entries(report).map(([key, value]) => {
      const exclude = [
        "_id", "userId", "__v", "companyName", "address", "businessSize",
        "reportTime", "reportDate", "notes", "file", "images"
      ];
      if (exclude.includes(key) || value === undefined || value === null || value === '') return null;

      return (
        <div key={key} className="border rounded px-2 py-2 bg-white">
          <p className="text-sm text-gray-700 font-extrabold capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </p>
   {typeof value === 'object' && !Array.isArray(value) ? (
  Object.entries(value).map(([innerKey, innerValue]) => (
    <div
      key={`${key}-${innerKey}`}
      className="border rounded px-2 py-2 bg-white mt-2"
    >
      <p className="text-sm text-gray-700 font-extrabold capitalize">
        {innerKey.replace(/([A-Z])/g, ' $1')}
      </p>
      <p className="text-gray-900">{String(innerValue)}</p>
    </div>
  ))
) : (
  <p className="text-gray-900">{String(value)}</p>
)}


        </div>
      );
    })}

    {/* File */}
    {report.file?.url && (
      <div className="border rounded px-2 py-2 bg-white">
        <p className="text-sm text-gray-700 font-extrabold">File</p>
        <a
          href={report.file.url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-all"
        >
          {decodeURIComponent(report.file.name)}
        </a>
      </div>
    )}

    {/* Images */}
    {report.images?.length > 0 && (
      <div className="border rounded px-2 py-2 bg-white">
        <p className="text-sm text-gray-700 font-extrabold mb-2">Images</p>
        <div className="flex gap-3 overflow-x-auto">
          {report.images.map((imgUrl, index) => (
            <a key={index} href={imgUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={imgUrl}
                alt={`Report ${idx + 1} Image ${index + 1}`}
                className="h-24 w-24 object-cover rounded border hover:scale-105 transition-transform"
              />
            </a>
          ))}
        </div>
      </div>
    )}
  </div>
))}


</div>

          </div>
        )
      )}
    </div>
  </div>
)}

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
 </div>


   </div>
 
   
   
   );
 };
 
 export default Subreports;
 