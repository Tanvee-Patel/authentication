import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function VerifyOtp() {
  const { email } = useParams();
  const decodedEmail = decodeURIComponent(email);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!decodedEmail) {
      toast.error('Invalid or missing email.');
      navigate('/forgot-password');
    }
  }, [decodedEmail, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast.error('OTP must be a valid 6-digit number.');
      return;
    }

    setIsLoading(true);
    try {
      const baseURL = 'http://localhost:8000';
      const { data } = await axios.post(`${baseURL}/forgot-password/verify-otp`, { email: decodedEmail, otp });
      toast.success(data?.message || 'OTP verified successfully.');
      navigate(`/reset-password/${encodeURIComponent(decodedEmail)}`);
    } catch (error) {
      console.error('Error during OTP verification:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-500 flex items-center justify-center px-6">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Verify OTP</h1>
        <p className="text-center text-gray-600 mb-6">
          Enter the One-Time Password (OTP) sent to your email address to verify your identity.
        </p>
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="otp">OTP</label>
            <input
              type="text"
              id="otp"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition duration-300 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn’t receive an OTP?{' '}
            <a href="/forgot-password" className="text-blue-500 hover:underline font-medium">
              Resend OTP
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
