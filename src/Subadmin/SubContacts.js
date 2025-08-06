import React, { useState, useEffect } from "react";
import Subsidebar from "./Subsidebar";

const SubContacts = () => {
  const [userContacts, setUserContacts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
const [editingContactId, setEditingContactId] = useState(null);

  const [formData, setFormData] = useState({
    contactName: "",
    contactNumber: "",
    contactNote: "",
    contactEmail: "",
    contactProfile: "",
    contactCompanyName: "",
    clientPurpose: "",
    partnerPurpose: "",
  });

  const handleEditContact = (contact) => {
    console.log('contact id ',contact._id)
  setIsEditMode(true);
  setEditingContactId(contact._id); 
  setFormData({
    contactName: contact.contactName || "",
    contactNumber: contact.contactNumber || "",
    contactNote: contact.contactNote || "",
    contactEmail: contact.contactEmail || "",
    purpose: contact.purpose || "",
    contactProfile: contact.contactProfile || "",
    contactCompanyName: contact.contactCompanyName || "",
  });
  setShowModal(true);
};


useEffect(()=>{fetchcontacts()},[])

  const fetchcontacts = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const tokenn = localStorage.getItem("token");

    if (storedUser && tokenn) {
      setToken(tokenn);

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${tokenn}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        `https://tracking-backend-admin.vercel.app/v1/subAdmin/getUserContact?employeeId=${storedUser.id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (
            result.success &&
            Array.isArray(result?.contactList?.contactDetails)
          ) {
            setUserContacts(result.contactList.contactDetails);
            console.log("first result", result);
          } else {
            setUserContacts([]);
          }
        })
        .catch((error) => {
          console.error(error);
          alert("Failed to fetch contacts.");
        });
    }
  };
 
 

 const saveContacts = () => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const purpose =
    formData.contactProfile === "client"
      ? formData.clientPurpose
      : formData.partnerPurpose;

  const payload = {
    contactName: formData.contactName,
    contactNumber: formData.contactNumber,
    contactNote: formData.contactNote,
    contactEmail: formData.contactEmail,
    contactProfile: formData.contactProfile,
    contactCompanyName: formData.contactCompanyName,
    purpose: purpose,
  };

  if (isEditMode) {
    payload.contactId = editingContactId;
  }

  const requestOptions = {
    method: isEditMode ? "PUT" : "POST",
    headers: myHeaders,
    body: JSON.stringify(payload),
    redirect: "follow",
  };

  fetch(
    isEditMode
      ? "https://tracking-backend-admin.vercel.app/v1/subAdmin/updateContactAfterCall"
      : "https://tracking-backend-admin.vercel.app/v1/subAdmin/saveContactAfterCall",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.success === true) {
        alert(isEditMode ? "Contact updated successfully!" : "Contact added successfully!");
        
        setShowModal(false);
        setIsEditMode(false);
        setEditingContactId(null);
        setFormData({
          contactName: "",
          contactNumber: "",
          contactNote: "",
          contactEmail: "",
          contactProfile: "",
          contactCompanyName: "",
          clientPurpose: "",
          partnerPurpose: "",
        });
  fetchcontacts(); 
      } else {
        alert("Failed to save contact.");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Error saving contact.");
    });
};


  return (
    <div className="flex h-screen overflow-hidden bg-gray-800 text-white">
  {/* Sidebar */}
  <div
    className={`w-64 fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out bg-gray-900 shadow-lg ${
      sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    }`}
  >
    <Subsidebar />
  </div>

  {/* Overlay for mobile */}
  {sidebarOpen && (
    <div
      className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
      onClick={() => setSidebarOpen(false)}
    ></div>
  )}

  {/* Mobile Topbar */}
  <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900 shadow-md p-4 flex items-center gap-4">
    <button onClick={() => setSidebarOpen(true)} className="text-white focus:outline-none">
      <i className="bi bi-list text-3xl"></i>
    </button>
    <h2 className="text-white text-xl font-semibold">Tracking App</h2>
  </div>

  {/* Main Content */}
  <main className="flex-1 overflow-y-auto md:ml-64 pt-20 md:pt-6 px-4 sm:px-6 bg-gray-800">
    {/* Sticky Add Button */}
    <div className="sticky top-0 z-30 bg-gray-800 pt-4 pb-2 flex justify-end">
      <button
       onClick={() => {
    setFormData({
      contactName: "",
      contactNumber: "",
      contactNote: "",
      contactEmail: "",
      contactProfile: "",
      contactCompanyName: "",
      clientPurpose: "",
      partnerPurpose: "",
    });
    setIsEditMode(false);
    setEditingContactId(null);
    setShowModal(true);
  }}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
        Add New Contact
      </button>
    </div>

    {/* Contacts */}
    {userContacts.length === 0 ? (
      <div className="text-center text-gray-300 py-10">
        <i className="bi bi-emoji-frown text-4xl mb-2"></i>
        <p className="text-lg">No contacts found for this user.</p>
      </div>
    ) : (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
  {userContacts.map((contact, index) => (
    <div
      key={contact._id || index}
      className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow-md relative w-full break-words"
    >
      <h3 className="font-bold text-lg mb-1 break-words">{contact.contactName}</h3>
      <p className="text-sm text-gray-300 break-words">
        Phone: {contact.contactNumber}
      </p>
      <p className="text-sm text-gray-300 break-words">
        Email: {contact.contactEmail}
      </p>
      <p className="text-sm text-gray-300 break-words">
        Company: {contact.contactCompanyName}
      </p>
      <p className="text-sm text-gray-300 break-words">
        Purpose: {contact.purpose}
      </p>
      <p className="text-sm text-gray-300 break-words">
        Note: {contact.contactNote}
      </p>
      <p className="text-sm text-gray-300 break-words">
        Profile: {contact.contactProfile}
      </p>

      <button
        className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-black text-xs rounded hover:bg-yellow-600"
        onClick={() => {
          console.log("contact id", contact._id);
          handleEditContact(contact);
        }}
        title="edit this contact"
      >
        Edit contact
      </button>
    </div>
  ))}
</div>
    )}
  </main>

  {/* Modal */}
  {showModal && (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 z-50 flex items-center justify-center px-2 sm:px-4 overflow-auto">
      <div className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative mt-10 mb-10">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
          onClick={() => setShowModal(false)}
        >
          <i className="bi bi-x-lg text-lg"></i>
        </button>

        <h2 className="text-xl font-semibold mb-4">Save Contact</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <input
            placeholder="Contact Name"
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            className="p-2 bg-gray-800 border border-gray-600 rounded w-full text-white"
          />
          <input
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
            className="p-2 bg-gray-800 border border-gray-600 rounded w-full text-white"
          />
          <input
            placeholder="Contact Email"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            className="p-2 bg-gray-800 border border-gray-600 rounded w-full text-white"
          />
          <input
            placeholder="Company Name"
            value={formData.contactCompanyName}
            onChange={(e) => setFormData({ ...formData, contactCompanyName: e.target.value })}
            className="p-2 bg-gray-800 border border-gray-600 rounded w-full text-white"
          />
          <select
            value={formData.contactProfile}
            onChange={(e) => setFormData({ ...formData, contactProfile: e.target.value })}
            className="p-2 bg-gray-800 border border-gray-600 rounded w-full text-white"
          >
            <option value="" disabled>
              Select Profile
            </option>
            <option value="partner">partner</option>
            <option value="client">client</option>
            <option value="vendor">colleague</option>
          </select>
      {formData.contactProfile === "client" && (
  <select
    value={formData.clientPurpose}
    onChange={(e) =>
      setFormData({ ...formData, clientPurpose: e.target.value })
    }
    className="p-2 bg-gray-800 border border-gray-600 rounded w-full text-white"
  >
    <option value="" disabled>
      Select client Purpose
    </option>
    <option value="New Enquiry">New Enquiry</option>
    <option value="clarafication for a transaction">Clarification for a transaction</option>
  </select>
)}

{formData.contactProfile === "partner" && (
  <input
    placeholder="Select their industry"
    value={formData.partnerPurpose}
    onChange={(e) =>
      setFormData({ ...formData, partnerPurpose: e.target.value })
    }
    className="p-2 bg-gray-800 border border-gray-600 rounded w-full text-white"
  />
)}  

          <textarea
            placeholder="Contact Note"
            value={formData.contactNote}
            onChange={(e) => setFormData({ ...formData, contactNote: e.target.value })}
            className="col-span-1 sm:col-span-2 p-2 bg-gray-800 border border-gray-600 rounded h-24 w-full text-white"
          ></textarea>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={saveContacts}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default SubContacts;
