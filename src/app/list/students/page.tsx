'use client';

import ProtectedRoute from '@/components/ProtectedRoutes';
import React, { useState, useMemo, useEffect } from 'react';

// Define the type for each item in the list
interface PaperData {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Sort the list by id in ascending order
const sortById = (list: PaperData[]) => {
  return [...list].sort((a, b) => a.id - b.id);
};

// Function to chunk the list into smaller arrays
const chunkList = (list: PaperData[], chunkSize: number): PaperData[][] => {
  const result: PaperData[][] = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    result.push(list.slice(i, i + chunkSize));
  }
  return result;
};

const Page = () => {

  const [data, setData] = useState<PaperData[]>([]); // State to store fetched data
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [currentTableIndex, setCurrentTableIndex] = useState(0); // State for pagination
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState<string | null>(null); // State to handle errors

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('authToken'); // Get the auth token
        const response = await fetch('http://localhost:8080/api/v1/information/all-students', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result: PaperData[] = await response.json();
        setData(result); // Update state with fetched data
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Pre-sort data by ID for the initial load
  const sortedData = useMemo(() => sortById(data), [data]);

  // Filter and sort data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;

    const lowerSearch = searchTerm.toLowerCase();

    // First, filter by `firstname` starting with the search term
    const filteredByFirstName = sortedData.filter((item) =>
      item.firstName.toLowerCase().startsWith(lowerSearch)
    );

    // If no match is found in `firstname`, fallback to `lastname`
    if (filteredByFirstName.length === 0) {
      return sortedData.filter((item) =>
        item.lastName.toLowerCase().startsWith(lowerSearch)
      );
    }

    return filteredByFirstName;
  }, [searchTerm, sortedData]);

  // Split the data into pages
  const chunkedData = useMemo(() => chunkList(filteredData, 10), [filteredData]);
  const totalPages = chunkedData.length;

  const goToNextTable = () => {
    if (currentTableIndex < totalPages - 1) {
      setCurrentTableIndex(currentTableIndex + 1);
    }
  };

  const goToPreviousTable = () => {
    if (currentTableIndex > 0) {
      setCurrentTableIndex(currentTableIndex - 1);
    }
  };

  if (isLoading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">Error: {error}</div>;
  }

  return (
  <ProtectedRoute allowedRoles={["TEACHER","MANAGER", "ADMIN", "FINANCE"]}>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="font-mono text-4xl font-bold text-gray-700 mb-4 text-center">
        Student List
      </h2>

      <form className="max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter Name ..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentTableIndex(0); // Reset pagination to the first page
            }}
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>

            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:shadow-lg"
                onClick={goToPreviousTable}
                disabled={currentTableIndex === 0}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:shadow-lg"
                onClick={goToNextTable}
                disabled={currentTableIndex === totalPages - 1}
              >
                Next
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                {currentTableIndex + 1}/{totalPages || 1}
              </h3>
              <table className="table-auto w-full bg-white shadow-md rounded-lg border border-gray-200">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Id</th>
                    <th className="px-4 py-2 text-left">User Name</th>
                    <th className="px-4 py-2 text-left">First Name</th>
                    <th className="px-4 py-2 text-left">Last Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {chunkedData[currentTableIndex]?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border-t border-gray-200">{row.id}</td>
                      <td className="px-4 py-2 border-t border-gray-200">{row.username}</td>
                      <td className="px-4 py-2 border-t border-gray-200">{row.firstName}</td>
                      <td className="px-4 py-2 border-t border-gray-200">{row.lastName}</td>
                      <td className="px-4 py-2 border-t border-gray-200">{row.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    </ProtectedRoute>
  );
};

export default Page;