import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtected = ({ children }) => {
  const token = localStorage.getItem('Admintoken');

  if (!token) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('rtoken');

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtected;
