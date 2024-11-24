"use client"

import Image from 'next/image'
import React, { useState } from 'react'

const NavbarHomePage = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [responsiveCheck, setResponsiveCheck] = useState(false);

  // Toggle the mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div>
      <div className="flex justify-between items-center bg-slate-600 p-4">
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <Image src="/logo.png" alt="ROK Logo" height={35} width={35} />
        <span className="text-white font-semibold text-lg">
          ROK Paper Class
        </span>
      </div>

      {/* Hamburger Icon for Mobile */}
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

      {/* Navigation Links */}
      <nav
        className={`lg:flex space-x-4 ${
          responsiveCheck ? "block" : "hidden"
        } lg:block`}
      >
        <a href="#contact-us" className="text-white hover:text-lg">
          Contact Us
        </a>
        <a href="#help" className="text-white hover:text-lg">
          Help
        </a>
        <a href="#" className="text-white hover:text-lg">
          Logout
        </a>
        <a href="#faq" className="text-white hover:text-lg">
          FAQ
        </a>
      </nav>
      </div>

      {/* Dropdown Menu for Mobile */}
      {isMenuOpen && (
        <div className="lg:hidden bg-slate-600 text-white py-2 space-y-2 text-center">
          <a href="#contact-us" className="block hover:bg-slate-700 py-1">
            Contact Us
          </a>
          <a href="#help" className="block hover:bg-slate-700 py-1">
            Help
          </a>
          <a href="#" className="block hover:bg-slate-700 py-1">
            Logout
          </a>
          <a href="#faq" className="block hover:bg-slate-700 py-1">
            FAQ
          </a>
        </div>
      )}
    </div>
  );
};

export default NavbarHomePage;