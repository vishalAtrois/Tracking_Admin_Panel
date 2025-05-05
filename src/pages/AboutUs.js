import React from 'react';
import Sidebar from '../components/Sidebar';

// Dummy data for About Us
const aboutUsData = {
  title: "About Us",
  description: "We are a passionate team dedicated to providing innovative solutions for businesses worldwide. Our goal is to empower organizations with cutting-edge technology and unmatched expertise. Founded in 2015, we have successfully worked with clients across various industries, helping them scale their operations and optimize their processes. Our team consists of experienced professionals who are committed to delivering high-quality results and exceptional customer service. Join us on our journey to make the world a better place through technology."
};

const AboutUs = () => {
  return (
    <div className="flex h-screen overflow-auto  bg-gray-900">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-900 ml-64">
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{aboutUsData.title}</h2>
      <p className="text-lg text-gray-700">{aboutUsData.description}</p>
    </div>
    </div>
    </div>
  );
};

export default AboutUs;
