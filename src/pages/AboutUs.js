import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

// Dummy data for About Us
const aboutUsData = {
  title: "About Us",
  description: "We are a passionate team dedicated to providing innovative solutions for businesses worldwide. Our goal is to empower organizations with cutting-edge technology and unmatched expertise. Founded in 2015, we have successfully worked with clients across various industries, helping them scale their operations and optimize their processes. Our team consists of experienced professionals who are committed to delivering high-quality results and exceptional customer service. Join us on our journey to make the world a better place through technology."
};

const AboutUs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900">
      {/* side bar icon */}
      <div className="md:hidden p-4 bg-gray-800 shadow-md z-50 flex items-center justify-start gap-4">
  <button onClick={() => setSidebarOpen(true)} className="text-white focus:outline-none">
    <i className="bi bi-list text-3xl"></i>
  </button>
  <h2 className="text-white text-xl font-semibold">About us </h2>
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

    <div className="flex-1 p-6 overflow-y-auto">
      {/* The rest of your component (search bar, table, pagination, modals, etc.) remains exactly the same */}

      {/* Insert your previous design code from this point onward */}
      <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{aboutUsData.title}</h2>
      <p className="text-lg text-gray-700">{aboutUsData.description}</p>
    </div>

    </div>
  </div>
  );
};

export default AboutUs;
