"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface MarksheetProps {
  currentQuestion: number;
  answers: number[];
  isReadingPhase: boolean;
  handleNext: () => void;
  handlePrevious: () => void;
  handleReadingSubmit: (timeTaken: number) => void;
  handleListeningSubmit: (timeTaken: number) => void;
  onStartPaper: () => void;
  onStopAudio: () => void;
}

const Marksheet: React.FC<MarksheetProps> = ({
  currentQuestion,
  answers,
  isReadingPhase,
  handleNext,
  handlePrevious,
  handleReadingSubmit,
  handleListeningSubmit,
  onStartPaper,
  onStopAudio,


}) => {
  const [testTime, setTestTime] = useState(1500); // 25 minutes for both reading and listening
  const [isTimerStopped, setIsTimerStopped] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [endCountdown, setEndCountdown] = useState<number | null>(null); // Countdown for ending paper
  const router = useRouter();
  const [paperType, setPaperType] = useState<string | null>(null);


  useEffect(() => {
    // Ensure localStorage is only accessed on the client side
    if (typeof window !== "undefined") {
      const storedPaperType = localStorage.getItem("currentPaperType");
      setPaperType(storedPaperType);
    }
  }, []);

  // Function to fetch questions and store them in localStorage
  const fetchQuestions = async () => {
    const token = localStorage.getItem("authToken");
    const paperId = localStorage.getItem("currentPaperNo");

    if (!paperId) {
      console.error("Paper ID not found in localStorage.");
      return;
    }

    try {
      const questions = await Promise.all(
        Array.from({ length: 20 }, (_, index) =>
          fetch(`http://localhost:8080/api/v1/papers/viewQuestion`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ paper_id: Number(paperId), question_id: index + 1 }),
          }).then((res) => res.json())
        )
      );

      localStorage.setItem("questions", JSON.stringify(questions));
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (countdown > 0) {
      interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0 && isTimerStopped) {
      fetchQuestions().then(() => {
        handleStartPaper();
      });
    }

    return () => clearInterval(interval);
  }, [countdown, isTimerStopped]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isTimerStopped && testTime > 0) {
      interval = setInterval(() => setTestTime((prev) => prev - 1), 1000);
    }

    if (testTime === 0) {
      startEndCountdown();
      if (paperType === "READING") {
        handleReadingSubmit(testTime);
      }
      else if(paperType === "LISTENING"){
        handleListeningSubmit(testTime);
      }
      
    }

    return () => clearInterval(interval);
  }, [testTime, isTimerStopped]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (endCountdown !== null) {
      interval = setInterval(
        () => setEndCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : prev)),
        1000
      );
    }

    if (endCountdown === 0) {
      localStorage.removeItem("currentQuestion"); // Clear current question
      router.push("/view-results");
    }

    return () => clearInterval(interval);
  }, [endCountdown]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStartPaper = () => {
    setIsTimerStopped(false);
    onStartPaper();
  };

  const startEndCountdown = () => {
    setEndCountdown(5); // Ending countdown of 5 seconds
  };

  const handleSubmit = () => {
    const timeTaken = 1500 - testTime;

    // Call the correct submit function based on paper type
    if (paperType === "READING") {
      handleReadingSubmit(timeTaken);
    } else if (paperType === "LISTENING") {
      handleListeningSubmit(timeTaken);
    }

    // Stop all audio playback on submit
    onStopAudio();

    // Clear the paper type from localStorage
    localStorage.removeItem("paperType");
  };

  return (
    <div className="w-full md:w-80 bg-gradient-to-b from-blue-50 to-blue-100 p-6 rounded-2xl shadow-xl">
      {isTimerStopped ? (
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 rounded-lg w-full mb-6 shadow-lg"
          disabled
        >
          {`Starting in ${countdown}...`}
        </button>
      ) : endCountdown !== null ? (
        <button
          className="bg-gradient-to-r from-gray-500 to-gray-700 text-white py-3 px-6 rounded-lg w-full mb-6 shadow-lg"
          disabled
        >
          {`Ending test... ${endCountdown}`}
        </button>
      ) : (
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-orange-600 hover:to-orange-800 text-white py-3 px-6 rounded-lg w-full mb-6 shadow-lg"
          onClick={handleSubmit}
        >
          Submit Answers
        </button>
      )}

      <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm">
        <p className="text-sm font-semibold text-gray-600">{isReadingPhase ? "READING" : "LISTENING"} (25 Min)</p>
        <p className="text-2xl font-bold text-gray-800">{formatTime(testTime)}</p>
      </div>

      {/* Answer Table */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          {[0, 10].map((start) => (
            <div key={start}>
              <table className="w-full text-center">
                <thead>
                  <tr className="bg-blue-200 text-sm">
                    <th className="py-2">#</th>
                    <th className="py-2">Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10).keys()].map((index) => {
                    const idx = start + index;
                    return (
                      <tr key={idx} className={`border-t border-gray-300 ${currentQuestion === idx ? "bg-gray-200" : ""}`}>
                        <td className="py-1">{idx + 1}</td>
                        <td className="py-1">{answers[idx] ?? ""}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-orange-500 hover:to-orange-700 text-white py-2 px-5 rounded-lg shadow-md"
          onClick={handlePrevious}
        >
          &lt; PREVIOUS
        </button>
        <button
          className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-orange-500 hover:to-orange-700 text-white py-2 px-5 rounded-lg shadow-md"
          onClick={handleNext}
        >
          NEXT &gt;
        </button>
      </div>
    </div>
  );
};

export default Marksheet;
