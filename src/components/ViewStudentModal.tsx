import React, { useState } from 'react';

interface Student {
  username: string;
  email: string;
}

interface ViewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (username: string) => Promise<Student | null>;
}

const ViewStudentModal: React.FC<ViewStudentModalProps> = ({ isOpen, onClose, onSearch }) => {
  const [username, setUsername] = useState('');
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async () => {
    const data = await onSearch(username);
    if (data) {
      setStudentData(data);
      setErrorMessage('');
    } else {
      setStudentData(null);
      setErrorMessage('Student not found');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md transform transition-all">
        <h2 className="text-lg font-semibold mb-4">View Student</h2>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input mb-4"
        />
        <button
          onClick={handleSearch}
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
        >
          Search
        </button>

        {studentData ? (
          <div className="text-left">
            <p><strong>Username:</strong> {studentData.username}</p>
            <p><strong>Email:</strong> {studentData.email}</p>
          </div>
        ) : (
          <p className="text-red-500">{errorMessage}</p>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewStudentModal;
