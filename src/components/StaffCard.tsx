"use client";

import Image from 'next/image';
import React, { useState } from 'react';
import AddStudentModal from './AddStudentModal';
import ViewStudentModal from './ViewStudentModal';
import RemoveStudentModal from './RemoveStudentModal';
import { StudentFormData } from './AddStudentModal';

interface StaffCardProps {
  type: 'add' | 'view' | 'remove';
}

const StaffCard: React.FC<StaffCardProps> = ({ type }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  // Function to handle adding a student
  const handleAddStudent = async (data: StudentFormData) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        // console.log('Student added successfully');
      } else {
        console.error('Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  // Function to search for a student by username for viewing
  const handleSearchViewStudent = async (username: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/student/view/${username}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          username: data.username,
          email: data.email,
        };
      } else {
        console.error('Student not found');
        return null;
      }
    } catch (error) {
      console.error('Error searching student:', error);
      return null;
    }
  };

  // Function to search for a student by username for removal
  const handleSearchRemoveStudent = async (username: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/student/view/${username}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
        };
      } else {
        console.error('Student not found');
        return null;
      }
    } catch (error) {
      console.error('Error searching student:', error);
      return null;
    }
  };

  // Function to remove a student by username
  const handleRemoveStudent = async (username: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/student/remove/${username}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        // console.log('Student removed successfully');
      } else {
        console.error('Failed to remove student');
      }
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className='rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]'>
      <div className='flex justify-between items-center mb-4'>
        <span className={`text-[10px] bg-white px-2 py-1 rounded-full ${type === 'add' ? 'text-green-600' : type === 'remove' ? 'text-red-600' : 'text-blue-600'}`}>
          {type.charAt(0).toUpperCase() + type.slice(1)} Student
        </span>
        <Image src='/more.png' alt='' width={20} height={20} />
      </div>

      {type === 'add' && (
        <button onClick={handleOpenModal} className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600'>
          Add Student
        </button>
      )}

      {type === 'remove' && (
        <button onClick={handleOpenModal} className='w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600'>
          Remove Student
        </button>
      )}

      {type === 'view' && (
        <button onClick={handleOpenModal} className='w-full bg-purple-500 text-white py-2 mt-7 rounded-md hover:bg-purple-600'>
          View Student
        </button>
      )}

      {type === 'add' && <AddStudentModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleAddStudent} />}
      {type === 'view' && <ViewStudentModal isOpen={isModalOpen} onClose={handleCloseModal} onSearch={handleSearchViewStudent} />}
      {type === 'remove' && <RemoveStudentModal isOpen={isModalOpen} onClose={handleCloseModal} onSearch={handleSearchRemoveStudent} onRemove={handleRemoveStudent} />}
    </div>
  );
};

export default StaffCard;
