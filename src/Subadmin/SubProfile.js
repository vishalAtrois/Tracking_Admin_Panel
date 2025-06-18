import React, {  useEffect, useState } from 'react';
import { UserCircle, Mail, Phone, Building2, BadgeCheck } from 'lucide-react';
import Subsidebar from './Subsidebar';
 

const SubProfile = () => {
  const [profile, setProfile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `https://tracking-backend-admin.vercel.app/v1/subAdmin/getSubAdminById?subAdminId=${storedUser.id}`,
          { method: 'GET', redirect: 'follow' }
        );
        const result = await response.json();
        if (result.success) {
            console.log('profile response',result)
             
          setProfile(result.details);
        } else {
          console.error('Profile fetch failed');
           
        }
      } catch (error) {
        console.error('API Error:', error);
          
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-tr from-purple-100 via-blue-100 to-green-100">
      {/* Mobile header with toggle button */}
      <div className="md:hidden p-4 bg-gray-800 shadow-md flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => setSidebarOpen(true)} className="text-white text-2xl">
          ☰
        </button>
        <h2 className="text-white text-xl font-semibold">Tracking App</h2>
      </div>
      {/* Sidebar overlay (mobile only) */}
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
{/* Main Content */}
<div className="flex-1 p-0 md:p-6">
  <div className="bg-gray-800 h-full w-full min-h-screen shadow-2xl p-6">
    <div className="flex flex-col items-center mb-6">
      <UserCircle className="w-20 h-20 text-white mb-2" />
    </div>
    {profile ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
        <div className="flex items-center gap-3">
          <BadgeCheck className="text-white w-6 h-6" />
          <div>
            <p className="text-xs text-white">Full Name</p>
            <p className="text-lg font-semibold text-white">{profile.fullName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="text-white w-6 h-6" />
          <div>
            <p className="text-xs text-white">Email</p>
            <p className="text-lg font-semibold text-white">{profile.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="text-white w-6 h-6" />
          <div>
            <p className="text-xs text-white">Phone Number</p>
            <p className="text-lg font-semibold text-white">{profile.phoneNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Building2 className="text-white w-6 h-6" />
          <div>
            <p className="text-xs text-white">Company Name</p>
            <p className="text-lg font-semibold text-white">{profile.companyName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:col-span-2">
          <BadgeCheck className="text-white w-6 h-6" />
          <div>
            <p className="text-xs text-white">Role</p>
            <p className="text-lg font-semibold text-white capitalize">{profile.role}</p>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center text-white py-12">Loading profile...</div>
    )}
  </div>
 </div>
</div>
  );
};

export default SubProfile;
