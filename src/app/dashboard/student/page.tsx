"use client"

import Announcements from '@/components/Announcements'
import CalendarComponent from '@/components/Calendar'
import PaperCard from '@/components/PaperCard'
import ProtectedRoute from '@/components/ProtectedRoutes'
import ScoreChart from '@/components/ScoreChart'
import React, { useEffect, useState } from 'react'

interface PaperData {
  paperNo: number;
  completed: boolean;
  type: string;
}

const StudentPage: React.FC = () => {
  const [sets, setSets] = useState(0);
  const [papers, setPapers] = useState<PaperData[]>([]);
  const [nextPaper, setNextPaper] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const papersPerPage = 20;

    useEffect(() => {
      const fetchStudentSets = async () => {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:8080/api/v1/student/sets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const setsData = await response.json();
        setSets(setsData);
        return setsData;
      };


    const fetchNextPaper = async () => {
      const token = localStorage.getItem("authToken");
      const nextPaperResponse = await fetch("http://localhost:8080/api/v1/marks/nextPaper", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const nextPaperData = await nextPaperResponse.json();
      setNextPaper(nextPaperData);
      return nextPaperData;
    };

    const safeFetch = async (url: string, options: RequestInit = {}): Promise<Response | null> => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          if (response.status === 404) {
            // Handle 404 errors silently (return null)
            return null;
          }
          console.warn(`HTTP Warning: ${response.status} at ${url}`); // Log non-critical warnings
          throw new Error(`HTTP Error: ${response.status}`);
        }
        return response; // Return successful response
      } catch (error) {
        if (error.message.includes("HTTP Error")) {
          // Suppress HTTP errors from being logged explicitly
          return null;
        }
        console.error(`Network Error: ${error.message}`);
        return null;
      }
    };

    const fetchPaperData = async (maxSets: number, maxNextPaper: number) => {
      const token = localStorage.getItem("authToken");
      const paperData: PaperData[] = [];
      for (let i = 1; i <= maxSets; i++) {
        const response = await safeFetch(`http://localhost:8080/api/v1/papers/checkPaper?paper_id=${i}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const isPaperAvailable = response !== null;
        const data = isPaperAvailable ? await response.json() : null;
    
        paperData.push({
          paperNo: i,
          completed: i <= maxNextPaper,
          type: isPaperAvailable ? data.paperType : "Not Added",
        });
      }
      setPapers(paperData);
    };

    // Fetch `sets` and `nextPaper`, then fetch paper data
    fetchStudentSets().then((setsData) => {
      fetchNextPaper().then((nextPaperData) => {
        fetchPaperData(setsData, nextPaperData);
      });
    });
  }, []);

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
    <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]}>
      <div className='p-4 flex gap-4 flex-col xl:flex-row'>
        {/* Left */}
        <div className='w-full xl:w-2/3'>
          <div className='h-full bg-white p-4 rounded-md'>
            <h1 className='text-xl font-semibold text-center'>Your Papers (Class X)</h1>
            <div className='grid grid-cols-4 gap-4'>
              {currentPapers.map((paper) => (
                <PaperCard key={paper.paperNo} paperNo={paper.paperNo} completed={paper.completed} type={paper.type}/>
              ))}
            </div>

            {/* Pagination controls */}  
            <div className='flex justify-between mt-4'>
              <button 
                onClick={handlePrevPage} 
                // disabled={currentPage === 0}
                className='px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50 hover:bg-slate-500'>
                Previous
              </button>
              <button 
                onClick={handleNextPage} 
                // disabled={currentPage === Math.floor(papers.length / papersPerPage) - 1}
                className='px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50 hover:bg-slate-500'>
                Next
              </button>
            </div> 
            {/* Score Chart */}
          <div className='w-full h-[450px]'><ScoreChart/></div>
          </div>
        </div>
        {/* Right */}
        <div className='w-full xl:w-1/3 flex flex-col gap-8'>
          <CalendarComponent/>
          <Announcements/>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default StudentPage