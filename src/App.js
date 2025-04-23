import React from 'react';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Companies from './pages/Companies';
import AboutUs from './pages/AboutUs';
import Notifications from './pages/Notification'; // if you have this
import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      {/* <div className="flex h-screen overflow-auto">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-900 ml-64">  */}
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        {/* </div>
      </div> */}
    </Router>
  );
}

export default App;
