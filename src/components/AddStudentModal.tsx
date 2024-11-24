import React, { useState } from 'react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => Promise<void>;
}

export interface StudentFormData {
  email: string;
  firstName: string;
  lastName: string;
  nic: string;
  examDate: string;
  gender: string;
  status: string;
  sets: number;
  role: string;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<StudentFormData>({
    email: '',
    firstName: '',
    lastName: '',
    nic: '',
    examDate: '',
    gender: 'Male',
    status: 'Scholarship',
    sets: 20,
    role: 'STUDENT',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Start loading
    await onSubmit(formData);
    setIsLoading(false); // Stop loading
    onClose(); // Close modal after submission completes
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md transform transition-all">
        <h2 className="text-xl font-semibold mb-4">Add Student</h2>
        <input name="email" placeholder="Email" onChange={handleChange} className="input mb-2" />
        <input name="firstName" placeholder="First Name" onChange={handleChange} className="input mb-2" />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} className="input mb-2" />
        <input name="nic" placeholder="NIC" onChange={handleChange} className="input mb-2" />
        <input name="examDate" type="date" onChange={handleChange} className="input mb-2" />

        <select name="gender" value={formData.gender} onChange={handleChange} className="input mb-2">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select name="status" value={formData.status} onChange={handleChange} className="input mb-2">
          <option value="Scholarship">Scholarship</option>
          <option value="Half Scholarship">Half Scholarship</option>
          <option value="Paid">Paid</option>
        </select>

        <select name="sets" value={formData.sets} onChange={handleChange} className="input mb-4">
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-2 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 mx-auto text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            'Submit'
          )}
        </button>
        <button
          onClick={onClose}
          disabled={isLoading}
          className={`w-full py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddStudentModal;
