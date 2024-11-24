import { useRouter } from 'next/navigation';
import React from 'react';

interface PaperCardProps {
  paperNo: number;
}

const PaperCardTeacher: React.FC<PaperCardProps> = ({ paperNo }) => {
  const router = useRouter(); // Initialize the router

  const handleClick = () => {
    // Redirect to the AddPaper page corresponding to the paper number
    router.push(`/papers_teacher/paper?paperNo=${paperNo}`);
  };

  return (
    <div
      className={`rounded-2xl p-1 flex-1 min-w-[20px] bg-lamaYellow cursor-pointer hover:bg-lamaPurple transition-all duration-300`}
      onClick={handleClick}
    >
      <h1 className='text-xl font-semibold my-4 text-center'>Paper {paperNo}</h1>
    </div>
  );
};

export default PaperCardTeacher;
