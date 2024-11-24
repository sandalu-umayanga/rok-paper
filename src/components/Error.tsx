import React from 'react';

interface ErrorProps {
  message: string; 
}

const Error: React.FC<ErrorProps> = ({ message }) => {
  return (
    <div>
      <div role="alert" className="w-96">
        <div className="bg-red-500 text-white font-bold rounded-t-lg px-4 py-2 text-center flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-.01-10a9 9 0 110 18 9 9 0 010-18z"
            />
          </svg>
          ERROR
        </div>
        <div className="border border-t-0 border-red-400 rounded-b-lg bg-red-100 px-4 py-3 text-red-700 text-center">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Error;
