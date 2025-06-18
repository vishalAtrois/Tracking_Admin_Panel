// SubVerifyOtp.jsx
import React, { useState, useRef } from 'react';
  import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const SubVerifyOtp = () => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const inputRefs = useRef([]);


const location = useLocation();
const navigate = useNavigate();
const [email, setEmail] = useState(location.state?.email || '');


  const handleChange = (index, value) => {
    if (!/\d?/.test(value)) return;
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  

 const handleVerifyOtp = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');

  const otp = otpDigits.join('');

  const url = `https://tracking-backend-admin.vercel.app/v1/subAdmin/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;

  try {
    const response = await fetch(url, { method: 'GET', redirect: 'follow' });
    const result = await response.json();

    console.log('OTP Verify result:', result); // DEBUG
    console.log('response.ok:', response.ok); // DEBUG

   if (response.ok) { 
  console.log('Before navigate'); // <--- Add this
  navigate('/ResetPassword');
  console.log('After navigate'); // <--- Add this
}
else {
      setMessage(result?.message || 'OTP Verification Failed');
    }
  } catch (error) {
    console.error('OTP verify error:', error);
    setMessage('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 px-4">
      <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <ShieldCheck className="h-9 w-9 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Verify OTP</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Check your email and enter the 4-digit code</p>

        <form onSubmit={handleVerifyOtp}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
               readOnly
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
            <div className="flex justify-center gap-4">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-16 h-16 text-center text-xl border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  required
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md transition duration-300 ${
              loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        {message && <div className="mt-4 text-center text-sm text-blue-600 animate-pulse">{message}</div>}

        <div className="mt-6 text-center text-sm text-gray-500">
          <a href="/" className="text-purple-600 hover:underline">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubVerifyOtp;
