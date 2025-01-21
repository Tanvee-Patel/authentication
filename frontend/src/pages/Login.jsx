import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;

    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const { data: response } = await axios.post('/login', { email, password });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Login successful!');
        setData({ email: '', password: '' });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-500 flex items-center justify-center px-6">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Login</h1>
        <form onSubmit={loginUser} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline font-semibold">
              Register here
            </Link>
          </p>
          <p className="text-sm text-gray-600 mt-4">
            <Link to="/forgot-password" className="text-blue-500 hover:underline font-semibold">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
