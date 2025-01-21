import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl md:text-2xl tracking-wide">
          Authentication
        </div>
        <div className="space-x-6 flex items-center">
          <Link
            to="/"
            className="text-white hover:text-blue-400 font-medium transition duration-300 ease-in-out transform hover:scale-105"
          >
            Home
          </Link>
          <Link
            to="/register"
            className="text-white hover:text-blue-400 font-medium transition duration-300 ease-in-out transform hover:scale-105"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="text-white hover:text-blue-400 font-medium transition duration-300 ease-in-out transform hover:scale-105"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
