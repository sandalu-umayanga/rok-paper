'use client';

import React, { useState } from 'react';
import Table1 from './Component/Table1';
import Table2 from './Component/Table2';
import Table3 from './Component/Table3';
import ProtectedRoute from '@/components/ProtectedRoutes';

const Page = () => {
  const [selectedTable, setSelectedTable] = useState('table3');

  return (
    <ProtectedRoute allowedRoles={["TEACHER", "STUDENT", "MANAGER", "ADMIN"]}>
      <div>
        <div className="p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Sort by</h2>
          <div className="mb-6">
            <select
              onChange={(e) => setSelectedTable(e.target.value)} // Update the selected table on change
              className="p-3 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-[220px]"
            >
              <option value="table1" className="text-gray-700">Top Marks for Paper</option>
              <option value="table2" className="text-gray-700">Average Per Paper Set</option>
              <option value="table3" className="text-gray-700">Overall Marks</option>
            </select>
          </div>

          {/* Conditionally render tables based on the selected table */}
          {selectedTable === 'table1' ? (
            <Table1 />
          ) : selectedTable === 'table2' ? (
            <Table2 />
          ) : (
            <Table3 removePaperIdColumn /> // Pass a prop to remove the Paper Id column
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
