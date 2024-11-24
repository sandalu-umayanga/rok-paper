// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';

// interface Question {
//   questionText: string;
//   answer1: string;
//   answer2: string;
//   answer3: string;
//   answer4: string;
//   mediaLink?: string;
// }

// interface QuestionPaperProps {
//   currentQuestion: number;
//   selectedAnswer: number | null;
//   onAnswerSelect: (questionIndex: number, answer: number) => void;
//   audioStopped: boolean;
// }

// const QuestionPaper: React.FC<QuestionPaperProps> = ({
//   currentQuestion,
//   selectedAnswer,
//   onAnswerSelect,
//   audioStopped,
// }) => {

//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [playbackCount, setPlaybackCount] = useState<Record<number, number>>({});
//   const [audio] = useState(new Audio());

//   // Load questions from localStorage on component mount
//   useEffect(() => {
//     const storedQuestions = localStorage.getItem("questions");
//     if (storedQuestions) {
//       const parsedQuestions = JSON.parse(storedQuestions);
//       console.log("Loaded questions from localStorage:", parsedQuestions); // Debugging statement
//       setQuestions(parsedQuestions);
//     } else {
//       console.warn("No questions found in localStorage");
//     }
//   }, []);

//   const currentPaperType = localStorage.getItem("currentPaperType");

//   // Ensure the question exists at the current index
//   const currentQuestionData = questions[currentQuestion];

//   // Play audio twice automatically if the paper is listening type
//   useEffect(() => {
//     if (currentPaperType === "LISTENING" && currentQuestionData?.mediaLink && !audioStopped) {
//       const count = playbackCount[currentQuestion] || 0;

//       if (count < 2) {
//         audio.src = currentQuestionData.mediaLink;
//         audio.play();

//         audio.onended = () => {
//           if (count + 1 < 2) {
//             audio.play();
//           }
//           setPlaybackCount((prev) => ({
//             ...prev,
//             [currentQuestion]: count + 1,
//           }));
//         };
//       }
//     }

//     return () => {
//       // Stop the audio when component is unmounted or when audioStopped changes
//       audio.pause();
//       audio.currentTime = 0;
//     };
//   }, [currentQuestion, currentQuestionData, currentPaperType, playbackCount, audioStopped]);

//   if (!currentQuestionData) {
//     console.log("No question data available for index:", currentQuestion);
//     return <p>Loading... Please wait.</p>;
//   }

//   // Debugging statement for current question data
//   //console.log("Current Question Data:", currentQuestionData);
//   //console.log("Image URL:", currentQuestionData.mediaLink);

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-lg mt-6" style={{ maxWidth: '800px', margin: 'auto' }}>
//       {/* Question Text */}
//       <div className="mb-4">
//         <p className="text-xl font-semibold text-gray-800 text-center">
//           {currentQuestionData.questionText}
//         </p>
//       </div>

//       {/* Display Image if available and not Listening Paper */}
//       {currentPaperType !== "LISTENING" && currentQuestionData.mediaLink && (
//         <div className="mb-6 flex justify-center">
//           <Image
//             src={currentQuestionData.mediaLink}
//             alt="Question Media"
//             width={300}
//             height={100}
//             objectFit="contain"
//             className="rounded-lg border border-gray-200"
//             placeholder="blur"
//             blurDataURL="data:image/svg+xml;base64,<Placeholder SVG or Base64>"
//           />
//         </div>
//       )}

//       {/* Answer Options in Two Columns */}
//       <div className="grid grid-cols-2 gap-4">
//         {[currentQuestionData.answer1, currentQuestionData.answer3].map((option, index) => (
//           <button
//             key={index}
//             className={`border border-gray-300 px-4 py-3 rounded-lg flex items-center justify-start space-x-4 text-left hover:bg-blue-50 transition ${
//               selectedAnswer === index + 1 ? 'bg-blue-100 border-blue-400' : 'bg-white'
//             }`}
//             onClick={() => onAnswerSelect(currentQuestion, index + 1)}
//           >
//             <span
//               className={`border-2 rounded-full h-8 w-8 flex items-center justify-center transition-all duration-200 ${
//                 selectedAnswer === index + 1
//                   ? 'border-blue-500 bg-blue-500 text-white'
//                   : 'border-gray-300 text-gray-600'
//               }`}
//             >
//               {index + 1}
//             </span>
//             <span>{option}</span>
//           </button>
//         ))}
//         {[currentQuestionData.answer2, currentQuestionData.answer4].map((option, index) => (
//           <button
//             key={index + 2}
//             className={`border border-gray-300 px-4 py-3 rounded-lg flex items-center justify-start space-x-4 text-left hover:bg-blue-50 transition ${
//               selectedAnswer === index + 3 ? 'bg-blue-100 border-blue-400' : 'bg-white'
//             }`}
//             onClick={() => onAnswerSelect(currentQuestion, index + 3)}
//           >
//             <span
//               className={`border-2 rounded-full h-8 w-8 flex items-center justify-center transition-all duration-200 ${
//                 selectedAnswer === index + 3
//                   ? 'border-blue-500 bg-blue-500 text-white'
//                   : 'border-gray-300 text-gray-600'
//               }`}
//             >
//               {index + 3}
//             </span>
//             <span>{option}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QuestionPaper;
