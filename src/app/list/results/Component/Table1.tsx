import React, { useState, useEffect } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

const Table1 = ({ removePaperIdColumn = false }) => {
  const [data, setData] = useState([]); // State to store fetched data
  const [currentPage, setCurrentPage] = useState(0); // State for pagination
  const [paperId, setPaperId] = useState(1); // Default paperId
  const [searchPaperId, setSearchPaperId] = useState(""); // State for search input
  const itemsPerPage = 10; // Show 10 rows at a time

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Get auth token
        const response = await fetch(
          `http://localhost:8080/api/v1/marks/top100?paperId=${paperId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add JWT token to the headers
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setData(result); // Update data state
        setCurrentPage(0); // Reset to the first page
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [paperId]); // Refetch when paperId changes

  // Calculate the start and end index for pagination
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(data.length / itemsPerPage) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = () => {
    const newPaperId = parseInt(searchPaperId, 10);
    if (!isNaN(newPaperId) && newPaperId > 0) {
      setPaperId(newPaperId); // Update the paperId state
    } else {
      console.error("Invalid Paper ID");
    }
  };

  return (
    <div>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="mb-6 flex items-center justify-left">
          <input
            type="text"
            value={searchPaperId}
            onChange={(e) => setSearchPaperId(e.target.value)}
            placeholder="Enter Paper ID"
            className="p-2 border border-gray-300 rounded-md focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 ml-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        <div className="mb-6">
          <h2 className="font-mono font-bold text-4xl text-center text-gray-600">
            Marks For Students (Paper ID: {paperId})
          </h2>
        </div>
        <table className="table-auto w-full bg-white shadow-md rounded-lg border border-gray-200">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2 w-16"></th> {/* For Profile Image */}
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Rank</th>
              {!removePaperIdColumn && (
                <th className="px-4 py-2 text-left">Paper Id</th>
              )}
              <th className="px-4 py-2 text-left">Paper Type</th>
              <th className="px-4 py-2 text-left">Marks</th>
              <th className="px-4 py-2 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-t border-gray-200">
                  <Image
                    src={row.profileImageLink || "/placeholder.png"}
                    alt={`Profile of ${row.name}`}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </td>
                <td className="px-4 py-2 border-t border-gray-200">{row.name}</td>
                <td className="px-4 py-2 border-t border-gray-200">{row.rank}</td>
                {!removePaperIdColumn && (
                  <td className="px-4 py-2 border-t border-gray-200">
                    {row.paperId}
                  </td>
                )}
                <td className="px-4 py-2 border-t border-gray-200">
                  {row.paperType}
                </td>
                <td className="px-4 py-2 border-t border-gray-200">{row.marks}</td>
                <td className="px-4 py-2 border-t border-gray-200">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50 hover:bg-slate-500"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= Math.ceil(data.length / itemsPerPage) - 1}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50 hover:bg-slate-500"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// Prop validations
Table1.propTypes = {
  removePaperIdColumn: PropTypes.bool,
};

export default Table1;
