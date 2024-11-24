"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight, FaSyncAlt } from "react-icons/fa";
import Link from "next/link";

interface Question {
  questionText: string;
  options: string[];
  mediaLink?: string;
}

interface Answer {
  questionId: number;
  correctAnswer: number;
}

interface TopStudent {
  firstName: string;
  mark: number;
  rank: number;
}

interface HighestMark {
  highestMark: number;
  studentNames: string[];
}

const ViewResultsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [averageMarks, setAverageMarks] = useState<number | null>(null);
  const [highestMarksData, setHighestMarksData] = useState<HighestMark | null>(null);
  const [top10Students, setTop10Students] = useState<TopStudent[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [discussionLink, setDiscussionLink] = useState<string | null>(null);
  const [showDiscussionLink, setShowDiscussionLink] = useState(false);

  useEffect(() => {
    const storedScore = localStorage.getItem("score");
    const storedTime = localStorage.getItem("timeTaken")
    const currentPaperType = localStorage.getItem("currentPaperType");
    const storedAnswers = JSON.parse(localStorage.getItem("answers") || "[]");
    const storedQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
    const paperId = localStorage.getItem("currentPaperNo");

    if (storedScore) setScore(parseInt(storedScore, 10));
    if (storedTime) setTime(storedTime);
    if (storedAnswers) setAnswers(storedAnswers);

    if (storedQuestions) {
      const transformedQuestions = storedQuestions.map((q: any) => ({
        questionText: q.questionText,
        options: [q.answer1, q.answer2, q.answer3, q.answer4],
        mediaLink: currentPaperType !== "LISTENING" ? q.mediaLink : null,
      }));
      setQuestions(transformedQuestions);
    }

    const fetchResultsData = async () => {
      const token = localStorage.getItem("authToken");

      // Fetch correct answers
      try {
        const response = await fetch(`http://localhost:8080/api/v1/papers/getAllAnswers?paper_id=${paperId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setCorrectAnswers(data);
        } else {
          console.error("Failed to fetch correct answers");
        }
      } catch (error) {
        console.error("Error fetching correct answers:", error);
      }

      // Fetch highest marks
      try {
        const response = await fetch(`http://localhost:8080/api/v1/marks/highestMark?paperId=${paperId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setHighestMarksData(data);
        }
      } catch (error) {
        console.error("Error fetching highest marks:", error);
      }

      // Fetch average marks
      try {
        const response = await fetch(`http://localhost:8080/api/v1/marks/averageMarks?paperId=${paperId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setAverageMarks(data);
        }
      } catch (error) {
        console.error("Error fetching average marks:", error);
      }

      // Fetch top 10 students
      try {
        const response = await fetch(`http://localhost:8080/api/v1/marks/top10?paperId=${paperId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setTop10Students(data);
        }
      } catch (error) {
        console.error("Error fetching top 10 students:", error);
      }

      setIsLoading(false);
    };

    fetchResultsData();
  }, []);

  // Function to fetch the discussion link
  const fetchDiscussionLink = async () => {
    const paperId = localStorage.getItem("currentPaperNo");
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`http://localhost:8080/api/v1/papers/discussionLink?paper_id=${paperId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const link = await response.text();
        setDiscussionLink(link);
        setShowDiscussionLink(true); // Show the modal with the link
      } else {
        console.error("Failed to fetch discussion link");
      }
    } catch (error) {
      console.error("Error fetching discussion link:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-auto">
      <div className="absolute top-18 right-6 z-10 flex space-x-4">
        <button
          onClick={fetchDiscussionLink}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Discussion Link
        </button>
        <Link href="/dashboard/student">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
            Go to Dashboard
          </button>
        </Link>
      </div>

      {showDiscussionLink && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Discussion Link</h2>
            <p className="text-blue-600 underline break-words">
              <a href={discussionLink} target="_blank" rel="noopener noreferrer">
                {discussionLink}
              </a>
            </p>
            <button
              onClick={() => setShowDiscussionLink(false)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Leaderboard Section */}
      <div className="w-full md:w-1/4 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 shadow-lg rounded-lg md:rounded-none md:rounded-l-lg">
        <h2 className="text-lg font-bold mb-4 text-center md:text-left">Leaderboard</h2>
        <ul className="space-y-2">
          {top10Students.map((student, index) => (
            <li key={index} className="flex justify-between py-2 text-lg font-medium">
              <span>{student.firstName}</span>
              <span>Score: {student.mark}</span>
              <span>Rank: {student.rank}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <FaSyncAlt className="animate-spin text-blue-500 text-5xl" />
          </div>
        ) : (
          <div className="w-full max-w-xl">
            <div className="flex justify-between mb-6 text-center">
              {/* Score on the left */}
              <div className="text-lg md:text-xl font-semibold text-blue-600">
                Your Score: <span className="text-green-600">{score !== null ? score : "Loading..."}/200</span>
                <br />
                Time Taken: <span className="text-green-500">{time || "Loading..."}</span>
              </div>
              
              {/* Average Score in the center */}
              <div className="text-lg md:text-xl font-semibold text-gray-700">
                Average Score: <span className="text-orange-600">{averageMarks !== null ? averageMarks : "Loading..."}</span>
              </div>

              {/* Highest Score on the right */}
              <div className="text-lg md:text-xl font-semibold text-blue-600">
                Highest Score: <span className="text-green-600">{highestMarksData?.highestMark || "Loading..."}</span>
                <p className="text-sm text-gray-300">{highestMarksData?.studentNames.join(", ") || ""}</p>
              </div>
            </div>

            {/* Question Display */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border-t-4 border-blue-500">
              <h3 className="font-semibold text-base md:text-lg text-gray-700 mb-3">
                Question {currentQuestion + 1}
              </h3>
              <p className="text-gray-800 font-medium mb-4">{questions[currentQuestion]?.questionText}</p>

              {/* Image section with Next.js Image Optimization */}
              {questions[currentQuestion]?.mediaLink && (
                <div className="flex justify-center mb-6">
                  <Image
                    src={questions[currentQuestion].mediaLink}
                    alt="Question Media"
                    width={300}
                    height={200}
                    objectFit="contain"
                    className="rounded-lg border border-gray-200"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,<Placeholder SVG or Base64>"
                  />
                </div>
              )}

              {/* Answer options with conditional styling */}
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion]?.options.map((option, index) => {
                  const isUserAnswer = answers[currentQuestion] === index + 1;
                  const isCorrectOption =
                    correctAnswers.find((ans) => ans.questionId === currentQuestion + 1)?.correctAnswer === index + 1;

                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg text-left text-sm font-medium ${
                        isUserAnswer ? "bg-blue-100" : "bg-white"
                      } ${isCorrectOption ? "border border-red-500" : ""}`}
                    >
                      {index + 1}. {option}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex mt-8 gap-4 justify-center">
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                disabled={currentQuestion === 0}
                className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                disabled={currentQuestion === questions.length - 1}
                className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewResultsPage;
