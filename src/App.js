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
import Subnotification from './Subadmin/Subnotification';
import SubForgotPassword from './Subadmin/SubForgotPassword';
import SubVerifyOtp from './Subadmin/SubVerifyOtp';
import SubResetPassword from './Subadmin/SubResetPassword';
import SubProfile from './Subadmin/SubProfile';
import VoiceTasks from './Subadmin/VoiceTasks';
import SubPrefrences from './Subadmin/SubPrefrences';
import SubSendNotification from './Subadmin/SubSendNotification';
import SubNotificationUser from './Subadmin/SubNotificationUser';
import AdminNotification from './pages/AdminNotification';
import SubProtected from './Subadmin/SubProtedted';
import AdminProtected from './pages/AdminProtected';
import Prefrences from './pages/Prefrences';
 
 

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<AdminProtected><Dashboard /></AdminProtected>} />
            <Route path="/users" element={<Users />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/Logs" element={<Logs />} />
            <Route path="/Report" element= {<Report />} />
            <Route path="/adminNotification" element= {<AdminNotification />} />
            <Route path='/register' element={<Register />} />
            <Route path='/Prefrences' element={<Prefrences />} />
            <Route path="/Subdashboard" element={<SubProtected><Subdashboard /></SubProtected>} />
            <Route path="/suballtasks" element={<SubProtected><Suballtasks /></SubProtected>} />
            <Route path="/Subreports" element={<SubProtected> <Subreports /></SubProtected>} />
            <Route path='/Subemployees' element={<SubProtected> <Subemployees /></SubProtected>} />
            <Route path='/Subcheckin' element={<SubProtected> <Subcheckin /></SubProtected>} />
            <Route path='/Subnotification' element={<SubProtected> <Subnotification /></SubProtected>} />
            <Route path='/SubForgotPassword' element={ <SubForgotPassword />} />
            <Route path='/SubVerifyOtp' element={  <SubVerifyOtp /> } />
            <Route path='/ResetPassword' element={  <SubResetPassword /> } />
            <Route path='/SubProfile' element={<SubProtected> <SubProfile /></SubProtected>} />
            <Route path='/VoiceTasks' element={<SubProtected> <VoiceTasks /></SubProtected>} />
            <Route path='/SubPrefrences' element={<SubProtected> <SubPrefrences /></SubProtected>} />
            <Route path='/SubSendNotification' element={<SubProtected> <SubSendNotification /></SubProtected>} />
              <Route path='/SubNotificationUser' element={<SubProtected> <SubNotificationUser /></SubProtected>} />
          </Routes>
    </Router>
  );
}

export default App;
