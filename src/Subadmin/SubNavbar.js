import React from 'react';

const SubNavbar = ({ onMenuClick }) => {
  return (
    <nav className="bg-black text-white h-16 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-40">
      {/* Mobile hamburger icon */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={onMenuClick}
      >
        <i className="bi bi-list"></i>
      </button>

      <h2 className="text-xl font-bold">Tracking App</h2>

      <div className="flex gap-4 items-center">
        <i className="bi bi-gear text-xl cursor-pointer"></i>
        <i className="bi bi-person-circle text-xl cursor-pointer"></i>
      </div>
    </nav>
  );
};

export default SubNavbar;
