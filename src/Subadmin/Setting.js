import React, { useState } from 'react'
import Subsidebar from './Subsidebar'

export const Setting = () => {
         const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900">
        
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
            </div>
  )
}
