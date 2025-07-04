import React, { useEffect, useState, useRef } from 'react';
import { Mail, Phone, Building2, BadgeCheck } from 'lucide-react';
import Subsidebar from './Subsidebar';

const SubProfile = () => {
  const [profile, setProfile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subadminPreference, setSubadminPreference] = useState(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `https://tracking-backend-admin.vercel.app/v1/subAdmin/getSubAdminById?subAdminId=${storedUser.id}`
        );
        const result = await response.json();
        if (result.success) {
          setProfile(result.details);
        }
      } catch (error) {
        console.error('Profile API Error:', error);
      }
    };

    const fetchSubadminPreference = async () => {
      try {
        const response = await fetch(
          `https://tracking-backend-admin.vercel.app/v1/subAdmin/getMyPermissions?userId=${storedUser.id}`
        );
        const result = await response.json();
        if (result.success) {
          setSubadminPreference(result.permissions.permissions);
        }
      } catch (error) {
        console.log('Permissions API Error:', error);
      }
    };

    fetchProfile();
    fetchSubadminPreference();
  }, []);

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('button')
      ) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="bg-gradient-to-tr from-purple-100 via-blue-100 to-green-100 min-h-screen overflow-x-hidden">
      {/* Sidebar toggle button for mobile */}
      <div className="md:hidden flex justify-start p-4 sticky top-0 z-50 bg-gray-900">
        <button onClick={() => setSidebarOpen(true)} className="text-white text-3xl">
          <i className="bi bi-list"></i>
        </button>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main layout */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed md:relative z-50 top-0 left-0 h-full w-64 transform transition-transform duration-300 bg-gray-900 text-white shadow-lg ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <Subsidebar />
        </div>

        {/* Right content */}
        <div className="flex-1 p-4 mt-2 md:mt-6">
          <div className="bg-white shadow rounded-xl p-6 md:p-8">
            {profile ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-xl border border-gray-300 shadow-md p-5">
                  <ProfileInfo icon={<BadgeCheck />} label="Full Name" value={profile.fullName} />
                  <ProfileInfo icon={<Mail />} label="Email" value={profile.email} />
                  <ProfileInfo icon={<Phone />} label="Phone Number" value={profile.phoneNumber} />
                  <ProfileInfo icon={<Building2 />} label="Company Name" value={profile.companyName} />
                  <ProfileInfo icon={<BadgeCheck />} label="Role" value={profile.role} />
                </div>

          {subadminPreference && (
  <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 shadow-sm">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">Permissions</h3>
    <div className="space-y-3">
      {Object.entries(subadminPreference).map(([key, value]) => (
        <div
          key={key}
          className="flex justify-between items-center border-b pb-2"
        >
          <span className="capitalize text-gray-700 text-sm">
            {key.replace(/([A-Z])/g, ' $1')}
          </span>

          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-not-allowed">
            <input
              type="checkbox"
              checked={value}
              disabled
              className="sr-only peer"
            />
            <div
              className={`w-11 h-6 rounded-full transition-colors duration-300 ${
                value ? 'bg-green-500' : 'bg-gray-300'
              } peer-disabled:opacity-100 relative`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  value ? 'translate-x-full' : ''
                }`}
              ></div>
            </div>
          </label>
        </div>
      ))}
    </div>
  </div>
)}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-12">Loading profile...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileInfo = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 mb-4">
    <div className="mt-1 text-indigo-600 w-6 h-6">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base text-gray-800 font-semibold">{value}</p>
    </div>
  </div>
);

export default SubProfile;
