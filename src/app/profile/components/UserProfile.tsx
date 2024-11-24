import React, { useState } from 'react';

const UserProfile = ({ profileData }) => {
  const {
    username,
    firstName,
    lastName,
    position,
    profileImageLink,
    department,
    nic,
    employId,
    email,
  } = profileData;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const placeholderImage = 'https://via.placeholder.com/150'; // Placeholder image

  // Toggle the mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div>
      <div id="profile" className="flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className="bg-blue-500 text-white py-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">User Portal</h1>
            {/* Mobile Hamburger Icon */}
            <button
              className="lg:hidden text-white focus:outline-none"
              onClick={toggleMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          {isMenuOpen && (
            <div className="lg:hidden bg-blue-500 text-white py-2 space-y-2">
              <a href="#" className="block px-4 py-2">
                Home
              </a>
              <a href="#" className="block px-4 py-2">
                Profile
              </a>
              <a href="#" className="block px-4 py-2">
                Logout
              </a>
            </div>
          )}
        </header>

        {/* Middle Content */}
        <main className="flex-grow flex items-center justify-center bg-gray-100">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-blue-500 h-24"></div>
            <div className="flex justify-center -mt-12">
              <img
                id="profileImage"
                className="w-24 h-24 rounded-full border-4 border-white"
                src={profileImageLink || placeholderImage}
                alt="Profile Picture"
              />
            </div>

            {/* Profile Details */}
            <div className="text-center px-6 py-4">
              <h2 id="fullName" className="text-2xl font-bold text-gray-800">
                {firstName} {lastName}
              </h2>
              <p id="username" className="text-sm text-gray-500">
                Username: {username}
              </p>
              <p id="nic" className="text-sm text-gray-500">
                NIC: {nic}
              </p>
              <p id="email" className="text-sm text-gray-500">
                Email: {email}
              </p>
              <p id="position" className="text-sm text-gray-500">
                Position: {position}
              </p>
              <p id="department" className="text-sm text-gray-500">
                Department: {department}
              </p>
              <p id="employId" className="text-sm text-gray-500">
                Employee ID: {employId}
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-blue-500 text-white py-4">
          <div className="container mx-auto text-center">
            <p className="text-sm">© 2024 User Portal. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default UserProfile;
