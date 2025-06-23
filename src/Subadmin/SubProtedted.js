// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const SubProtected = ({ children }) => {
  const token = localStorage.getItem('token'); // Adjust 'token' to match your app

  if (!token) {
     localStorage.removeItem('user');
    localStorage.removeItem('Admintoken');
    localStorage.removeItem('rtoken');

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default SubProtected;
