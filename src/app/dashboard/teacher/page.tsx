"use client"

import ProtectedRoute from '@/components/ProtectedRoutes';
import Announcements from '@/components/Announcements';
import CalendarComponent from '@/components/Calendar';
import PaperCardTeacher from '@/components/PaperCardTeacher';
import ScoreChartTeacher from '@/components/ScoreChartTeacher';
import React, { useState, useEffect } from 'react';
import Loading from '@/components/Loading';

const papers = Array.from({ length: 100 }, (_, index) => ({
  paperNo: index + 1,
  link: ''
}));

const TeacherPage = () => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const papersPerPage = 20;

  // Pagination logic
  const startIndex = currentPage * papersPerPage;
  const endIndex = startIndex + papersPerPage;
  const currentPapers = papers.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < Math.floor(papers.length / papersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (

    
    <ProtectedRoute allowedRoles={["TEACHER", "ADMIN"]}>
    <div>

      {loading ? <Loading /> : <div> <div className='p-4 flex gap-4 flex-col xl:flex-row'>

        {/* Left */}
        <div className='w-full xl:w-2/3'>
          <div className='h-full bg-white p-4 rounded-md'>
            <div className='grid grid-cols-4 gap-4'>
              {currentPapers.map((paper) => (
                <PaperCardTeacher key={paper.paperNo} paperNo={paper.paperNo} />
              ))}
            </div>

            {/* Pagination controls */}
            <div className='flex justify-between mt-4'>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className='px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50 hover:bg-slate-500'>
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === Math.floor(papers.length / papersPerPage) - 1}
                className='px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50 hover:bg-slate-500'>
                Next
              </button>
            </div>
            {/* Score Chart */}
            <div className='w-full h-[450px]'><ScoreChartTeacher /></div>
          </div>
        </div>

        {/* Right */}
        <div className='w-full xl:w-1/3 flex flex-col gap-8'>
          <CalendarComponent />
          <Announcements />
        </div>
      </div>
      </div>}
    </div>
    </ProtectedRoute>

  )
}

export default TeacherPage