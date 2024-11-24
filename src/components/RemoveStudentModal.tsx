import React, { useState } from 'react';

interface Student {
  username: string;
  firstName: string;
  lastName: string;
}

interface RemoveStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (username: string) => Promise<Student | null>;
  onRemove: (username: string) => Promise<void>;
}

const RemoveStudentModal: React.FC<RemoveStudentModalProps> = ({ isOpen, onClose, onSearch, onRemove }) => {
  const [username, setUsername] = useState('');
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async () => {
    try {
      const data = await onSearch(username);
      // console.log(data);
      setStudentData(data);
      setErrorMessage(data ? '' : 'Student Not Found');
    } catch (error) {
      setErrorMessage('Error fetching student data');
    }
  };

  const handleRemove = async () => {
    if (studentData) {
      await onRemove(username);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md transform transition-all">
        <h2 className="text-xl font-semibold mb-4">Remove Student</h2>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input mb-4"
        />
        <button onClick={handleSearch} className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4">
          Search
        </button>
        
        {studentData ? (
          <div className="text-left">
            <p><strong>Username:</strong> {studentData.username}</p>
            <p><strong>Name:</strong> {studentData.firstName} {studentData.lastName}</p>
            <button onClick={handleRemove} className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mt-4">
              Confirm Removal
            </button>
          </div>
        ) : (
          <p className="text-red-500">{errorMessage}</p>
        )}

        <button onClick={onClose} className="w-full py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mt-4">
          Close
        </button>
      </div>
    </div>
  );
};

export default RemoveStudentModal;
