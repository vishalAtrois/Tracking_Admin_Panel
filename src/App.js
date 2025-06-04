import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
 import  Report  from "./pages/Report";
import  Register  from "./pages/Register";
import Companies from './pages/Companies';
import AboutUs from './pages/AboutUs';
import Notifications from './pages/Notification'; // if you have this
import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import Login from './pages/Login';
import { Suballtasks } from './Subadmin/Suballtasks';
import  Subreports  from './Subadmin/Subreports';
 
import { Subemployees } from './Subadmin/Subemployees';
import Subdashboard from './Subadmin/Subdashboard';
import { Subcheckin } from './Subadmin/Subcheckin';
import { Logs } from './pages/Logs';
 


function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/Logs" element={<Logs />} />
             <Route path="/Report" element= {<Report />} />
             <Route path='/register' element={<Register />} />
            <Route path="/Subdashboard" element={<Subdashboard />} />
             <Route path="/suballtasks" element={<Suballtasks />} />
              <Route path="/Subreports" element={<Subreports />} />
              <Route path='/Subemployees' element={<Subemployees />} />
              <Route path='/Subcheckin' element={<Subcheckin />} />
          </Routes>
    </Router>
  );
}

export default App;
