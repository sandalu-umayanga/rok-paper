import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface QuestionData {
  question_id: number;
  questionType: string;
  questionText: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  mediaLink?: string;
  timeAllocated?: number;
}

interface ViewQuestionModalProps {
  questionData: QuestionData;
  onClose: () => void;
}

const ViewQuestionModal: React.FC<ViewQuestionModalProps> = ({
  questionData,
  onClose,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [playCount, setPlayCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isAnsweringDisabled, setIsAnsweringDisabled] = useState(false);

  // Determine if mediaLink is an image or audio file
  const isImage = questionData.mediaLink?.match(/\.(jpeg|jpg|gif|png)$/i);
  const isAudio = questionData.mediaLink?.match(/\.(mp3|wav|ogg)$/i);

  // Initialize countdown timer if timeAllocated is provided and greater than zero
  useEffect(() => {
    if (questionData.timeAllocated && questionData.timeAllocated > 0) {
      setTimeRemaining(questionData.timeAllocated);
    }
  }, [questionData.timeAllocated]);

  // Countdown logic
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => (prev !== null ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer); // Cleanup on unmount or when timeRemaining changes
    } else if (timeRemaining === 0) {
      setIsAnsweringDisabled(true); // Disable answering when time is up
    }
  }, [timeRemaining]);

  // Format time into MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Play audio logic
  useEffect(() => {
    if (isAudio && audioRef.current) {
      const handlePlay = () => {
        if (playCount < 2) {
          audioRef.current?.play();
        }
      };

      const handleEnded = () => {
        setPlayCount((prev) => prev + 1);
        if (playCount < 1) {
          audioRef.current?.play();
        }
      };

      audioRef.current.addEventListener("ended", handleEnded);
      handlePlay();

      return () => {
        audioRef.current?.removeEventListener("ended", handleEnded);
      };
    }
  }, [isAudio, playCount]);

  // Helper function to determine if an answer is an image link
  const isAnswerImage = (answer: string) =>
    answer.match(/\.(jpeg|jpg|gif|png)$/i);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl relative">
        <h2 className="text-xl font-bold mb-4">View Question {questionData.question_id}</h2>

        {/* Countdown Timer */}
        {timeRemaining !== null && (
          <div className="absolute top-4 right-4 text-lg font-bold text-red-500">
            {formatTime(timeRemaining)}
          </div>
        )}

        {/* Display Image for READING type or Audio for LISTENING type based on questionType */}
        {isImage && questionData.mediaLink && (
          <div className="relative mb-4 w-full max-w-sm h-64 mx-auto rounded-lg overflow-hidden">
            <Image
              src={questionData.mediaLink}
              alt="Question Media"
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
        )}

        {isAudio && questionData.mediaLink && (
          <div className="mb-4 flex justify-center">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-full"
              onClick={() => audioRef.current?.play()}
            >
              ▶ Play Audio
            </button>
            <audio ref={audioRef} src={questionData.mediaLink} />
          </div>
        )}

        {/* Display Question Text */}
        <p className="mb-4">
          <strong>{questionData.questionText}</strong>
        </p>

        {/* Answers in Two Columns with Clickable Styling */}
        <div className="grid grid-cols-2 gap-4">
          {[questionData.answer1, questionData.answer2, questionData.answer3, questionData.answer4].map((answer, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 ${
                isAnsweringDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              } ${selectedAnswer === index + 1 ? "bg-blue-100" : ""}`}
              onClick={() => !isAnsweringDisabled && setSelectedAnswer(index + 1)} // Disable click when answering is disabled
            >
              <div
                className={`rounded-full w-8 h-8 flex items-center justify-center font-semibold ${
                  selectedAnswer === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {index + 1}
              </div>
              {isAnswerImage(answer) ? (
                <Image
                  src={answer}
                  alt={`Answer ${index + 1}`}
                  width={50}
                  height={50}
                  objectFit="contain"
                  className="rounded-md"
                />
              ) : (
                <span>{answer}</span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewQuestionModal;
