"use client"

import { useRouter } from 'next/navigation';
import React from 'react'

const EndPartHome = () => {

  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/sign-in'); // Redirects to the login page
  };

  return (
    <div className="flex h-[calc(100vh-450px)] w-full items-center justify-center p-8">
      <button className="bg-red-400 text-white text-lg font-semibold px-6 py-3 rounded shadow hover:bg-red-500 transition duration-300"
      onClick={handleLoginClick}>
        Log In
      </button>
    </div>
  )
}

export default EndPartHome