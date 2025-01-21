import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

import { UserContextProvider } from '../context/UserContext';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPwd';
import ResetPassword from './pages/ResetPwd';
import VerifyOtp from './pages/VerifyOtp';


axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Toaster position="bottom right" toastOptions={{ duration: 2000 }} />

      <Routes>
        <Route path="/" element={
          <>
          <Navbar/>
          <Home/>
          </>
        }
        />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/reset-password/:resetToken" element={<ResetPassword/>} />
        <Route path="/verify-otp/:email" element={<VerifyOtp/>}/>
      </Routes>
    </UserContextProvider>
  );
}

export default App; 