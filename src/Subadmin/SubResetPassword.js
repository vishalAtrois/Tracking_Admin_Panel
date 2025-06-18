import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';

const SubResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('subForgotPasswordToken');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!password || !confirmNewPassword) {
      return setMessage('Please fill in all fields.');
    }

    if (password !== confirmNewPassword) {
      return setMessage('Passwords do not match.');
    }

    setLoading(true);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const raw = JSON.stringify({ password, confirmNewPassword });

    const requestOptions = {
      method: 'POST',
      headers,
      body: raw,
      redirect: 'follow'
    };

    try {
      const response = await fetch(
        `https://tracking-backend-admin.vercel.app/v1/subAdmin/reset-password?token=${token}`,
        requestOptions
      );
      const result = await response.text();
if (response.ok) {
  localStorage.removeItem('subForgotPasswordToken'); // ✅ Clean up
  setMessage('✅ Password reset successfully!');
  setTimeout(() => navigate('/'), 2000);
} else {
        setMessage(result || 'Reset failed. Try again.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 px-4">
      <div className="bg-white border border-gray-200 shadow-2xl rounded-3xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">Reset Password</h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your new password below to regain access
        </p>

        <form onSubmit={handleResetPassword} className="space-y-5">
          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                className="w-full px-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => setShowConfirm((prev) => !prev)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md transition duration-300 ${
              loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className="mt-4 text-center text-sm text-purple-600 animate-pulse">{message}</div>
        )}
        <div className="mt-6 text-center text-sm text-gray-500">
          <a href="/" className="text-purple-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubResetPassword;
