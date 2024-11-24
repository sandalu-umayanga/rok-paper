import React, { useState, useEffect } from 'react';
import { FaLock, FaUnlock } from 'react-icons/fa';
import Link from 'next/link';

interface PaperCardProps {
  paperNo: number;
  completed: boolean;
  type?: string; // Paper type
}

const PaperCard: React.FC<PaperCardProps> = ({ paperNo, completed, type = "" }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (!completed) {
      e.preventDefault(); // Prevent navigation
      alert("Complete the previous paper before accessing this one.");
    } else {
      // Save paperType in localStorage
      localStorage.setItem("currentPaperNo", paperNo.toString());
      //console.log(paperNo)
      localStorage.setItem("currentPaperType", type);
    }
  };

  return (
    <Link href={completed ? `/papers/format` : "#"}>
      <div
        onClick={handleClick}
        className={`rounded-2xl p-3 flex flex-col justify-center items-center min-w-[20px] transition-all duration-300 ${
          completed ? "bg-lime-400 hover:bg-lime-600 cursor-pointer" : "bg-red-400 hover:bg-red-600 cursor-not-allowed"
        }`}
      >
        <h1 className="text-xl font-semibold mb-3 text-center text-white">Paper {paperNo}</h1>
        <p className="text-md font-medium text-white mb-2">{type.charAt(0).toUpperCase() + type.slice(1)} Paper</p>
        <div className="flex justify-center items-center text-white text-3xl">
          {completed ? <FaUnlock /> : <FaLock />}
        </div>
      </div>
    </Link>
  );
};

export default PaperCard;