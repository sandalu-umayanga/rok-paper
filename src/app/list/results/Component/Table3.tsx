import React, { useState, useEffect } from "react";
import Image from "next/image";

const Table3 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOverallRankings = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:8080/api/v1/marks/overallRanking", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch rankings data");

        const result = await response.json();
        setData(result);
        setCurrentPage(0); // Reset to the first page
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOverallRankings();
  }, []);

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">Error: {error}</div>;

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

  return (
    <div>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="mb-6">
          <h2 className="font-mono font-bold text-4xl text-center text-gray-600">
            Overall Marks
          </h2>
        </div>
        <table className="table-auto w-full bg-white shadow-md rounded-lg border border-gray-200">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2 w-16"></th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Average Time</th>
              <th className="px-4 py-2 text-left">Average Marks</th>
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
                <td className="px-4 py-2 border-t border-gray-200">{row.averageTime}</td>
                <td className="px-4 py-2 border-t border-gray-200">{row.averageMarks}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
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

export default Table3;
