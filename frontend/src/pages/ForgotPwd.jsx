import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please provide your email.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axios.post('/forgot-password', { email, action: 'sendOtp' });
      console.log(data);

      toast.success(data.message || 'OTP sent successfully.');
      console.log('Redirecting to verify OTP');
      navigate(`/verify-otp/${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('Error during OTP sending:', error);
      const errorMessage = error.response?.data?.message || 'Error sending OTP.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-500 flex items-center justify-center px-6">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Forgot Password</h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your registered email to receive a One-Time Password (OTP) for resetting your password.
        </p>
        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-700 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition duration-300 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remembered your password?{' '}
            <a href="/login" className="text-blue-500 hover:underline font-medium">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;