import React from 'react';

function Home() {
  return (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center px-4 text-white">
      <div className="text-center p-10">
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Welcome to Our Platform</h1>
        <p className="text-base mb-6 max-w-2xl mx-auto text-gray-300">
          Experience seamless authentication, user-friendly features, and secure account management. Join us today!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        <div className="bg-white text-gray-800 p-6 rounded-md shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
          <div className="text-4xl mb-4 text-blue-600">🔐</div>
          <h3 className="text-lg font-semibold mb-2">Advanced Security</h3>
          <p className="text-sm">
            Protecting your data with top-tier security measures and encrypted authentication.
          </p>
        </div>

        <div className="bg-white text-gray-800 p-6 rounded-md shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
          <div className="text-4xl mb-4 text-blue-600">✨</div>
          <h3 className="text-lg font-semibold mb-2">Quick Registration</h3>
          <p className="text-sm">
            Sign up effortlessly and gain access to exclusive features in no time.
          </p>
        </div>

        <div className="bg-white text-gray-800 p-6 rounded-md shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
          <div className="text-4xl mb-4 text-blue-600">⚙️</div>
          <h3 className="text-lg font-semibold mb-2">User Dashboard</h3>
          <p className="text-sm">
            Manage your profile settings and customize your experience easily.
          </p>
        </div>
      </div>

      <div className="bg-gray-100 text-gray-800 p-6 mt-12 rounded-md shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Need Help Logging In?</h2>
        <p className="text-sm mb-6 text-center text-gray-600">
          Reset your password with ease! Click on "Forgot Password" on the login page, and follow the steps to recover your account.
        </p>
      </div>
    </div>
  );
}

export default Home;
