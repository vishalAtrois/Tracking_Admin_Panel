import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailIcon } from 'lucide-react'; // Optional: use any icon you like

const SubForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({ email });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    try {
  const response = await fetch(
    'https://tracking-backend-admin.vercel.app/v1/subAdmin/forgot-Password',
    requestOptions
  );

  const result = await response.json();  

  if (response.ok && result.token) {
    localStorage.setItem('subForgotPasswordToken', result.token);  
    navigate('/SubVerifyOtp', { state: { email } });
  } else {
    setMessage(result.message || 'Failed to send OTP. Please try again.');
  }
} catch (error) {
  setMessage('Something went wrong. Please try again.');
  console.error(error);
} finally {
  setLoading(false);
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 px-4">
      <div className="bg-white shadow-2xl border border-gray-200 rounded-2xl p-8 w-full max-w-md transform transition-all duration-300">
        <div className="flex items-center justify-center mb-4">
          <MailIcon className="h-9 w-9 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Forgot your password?</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          We'll send a one-time code to your registered email.
        </p>

        <form onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md transition duration-300 ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm text-green-600 animate-pulse">{message}</div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <a href="/" className="text-blue-600 hover:underline">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubForgotPassword;
