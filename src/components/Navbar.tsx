"use client";

import axios from 'axios';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

const Navbar = () => {
  const [profileInfo, setProfileInfo] = useState({
    firstName: '',
    lastName: '',
    role: '',
    profileImageLink: '', // Will check and default to '/avatar.png' if empty
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch profile info on component mount
  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/auth/getUserProfileInfo', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setProfileInfo({
          ...response.data,
          profileImageLink: response.data.profileImageLink || '/avatar.png', // Default to avatar if no link
        });
      } catch (error) {
        console.error('Error fetching profile info:', error);
      }
    };

    fetchProfileInfo();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  // Handle file upload with compression
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      // Compress image file to reduce size under 1MB
      const compressedFile = await imageCompression(selectedFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 200, // Resize to 200px to match the icon size
        useWebWorker: true,
      });

      const formData = new FormData();
      formData.append('imageFile', compressedFile);

      await axios.post('http://localhost:8080/api/v1/auth/uploadProfileImage', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Profile image uploaded successfully!');
      setIsModalOpen(false);
      window.location.reload(); // Reload to reflect new profile image
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  return (
    <div className="flex items-center justify-between p-4">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="Search" width={14} height={14} />
        <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none" />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="Messages" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="Announcements" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">1</div>
        </div>

        {/* USER INFO */}
        <div className="flex flex-col text-right">
          <span className="text-xs font-medium">{profileInfo.firstName} {profileInfo.lastName}</span>
          <span className="text-[10px] text-gray-500">{profileInfo.role}</span>
        </div>

        {/* PROFILE IMAGE */}
        <div className="relative">
          <Image
            src={profileInfo.profileImageLink || '/avatar.png'} // Default to avatar if no link is provided
            alt="Profile Image"
            width={36}
            height={36}
            className="rounded-full cursor-pointer"
            onClick={() => setIsModalOpen(true)}
            onError={(e) => {
              e.currentTarget.src = '/avatar.png'; // Set fallback icon if image fails to load
            }}
          />
        </div>
      </div>

      {/* UPLOAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 z-50">
            <h2 className="text-lg font-semibold mb-4">Upload Profile Image</h2>

            {/* Display Current Profile Image */}
            <div className="flex justify-center mb-4">
              <Image
                src={profileInfo.profileImageLink || '/avatar.png'}
                alt="Current Profile Image"
                width={100}
                height={100}
                className="rounded-full"
                onError={(e) => {
                  e.currentTarget.src = '/avatar.png'; // Fallback to avatar if image fails to load
                }}
              />
            </div>

            {/* File Upload Input */}
            <input type="file" onChange={handleFileChange} className="mb-4" />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
