import React from 'react'


interface ErrorProps {
    message: string; 
  }

const Sucessfull: React.FC<ErrorProps> = ({ message }) => {
  return (
      <div role="alert" className="w-96 border-radius: 1rem">
          <div className="bg-green-500 text-white font-bold border-radius:1rem  px-4 py-2 text-center flex items-center justify-center">
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
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            SUCCESSFUL
          </div>
          <div className="border border-t-0 border-green-400 rounded-b bg-green-100 px-4 py-3 text-green-700 text-center">
            <p>{message}</p>
          </div>
    </div>
  )
}

export default Sucessfull
