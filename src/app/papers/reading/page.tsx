"use client";

import React, { useState, useEffect } from "react";
import QuestionPaper from "../components/QuestionPaper";
import { useRouter } from "next/navigation";
import Marksheet from "../components/MarkSheet";

const ReadingPaperPage: React.FC = () => {

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(20).fill(null));
  const [isPaperStarted, setIsPaperStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paperId, setPaperId] = useState<string | null>(null);
  const router = useRouter();


  useEffect(() => {
    // Ensure localStorage is only accessed on the client side
    if (typeof window !== "undefined") {
      const storedPaperId = localStorage.getItem("currentPaperNo");
      setPaperId(storedPaperId);
    }
  }, []);

  const handleStartPaper = () => setIsPaperStarted(true);

  const handleAnswerSelect = (questionIndex: number, answer: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = answer;
    setAnswers(updatedAnswers);
    localStorage.setItem("answers", JSON.stringify(updatedAnswers)); // Save answers to localStorage
  };

  const handleNextQuestion = () => {
    if (currentQuestion < 19) {
      setCurrentQuestion(currentQuestion + 1);
      localStorage.setItem("currentQuestion", (currentQuestion + 1).toString()); // Save current question to localStorage
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      localStorage.setItem("currentQuestion", (currentQuestion - 1).toString()); // Save current question to localStorage
    }
  };

  const handleSubmit = async (timeTaken: number) => {
    if (answers.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    console.log("Reading answers:", answers);

    // Check that timeTaken is a number
    if (typeof timeTaken !== "number") {
      console.error("Invalid timeTaken value:", timeTaken);
      return;
    }

    // Prepare answers in the required format
    const formattedAnswers = answers.map((answer, index) => ({
      questionId: index + 1,
      answer: answer ?? 0, // Default to 0 if no answer was selected
    }));

    const submitPayload = {
      paperId: paperId, // Set your paper ID
      answers: formattedAnswers,
      timeTaken: timeTaken,
    };

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:8080/api/v1/marks/submitMarks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitPayload),
      });

      if (response.ok) {
        const result = await response.json();
        //console.log("Marks submitted successfully");
        localStorage.setItem("score", result.score);
        localStorage.setItem("timeTaken", result.time);
        localStorage.removeItem("currentQuestion"); // Clear current question
        router.push("/papers/view-results"); // Navigate to results page
      } else {
        console.error("Failed to submit marks");
      }
    } catch (error) {
      console.error("Error submitting marks:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:space-x-4">
      <div className="w-full md:w-3/4 pt-8">
        {isPaperStarted && (
          <QuestionPaper
            currentQuestion={currentQuestion}
            selectedAnswer={answers[currentQuestion]}
            onAnswerSelect={handleAnswerSelect}
          />
        )}
      </div>

      <div className="w-full md:w-1/4 mt-4 md:mt-0">
        <Marksheet
          currentQuestion={currentQuestion}
          answers={answers}
          isReadingPhase={true}
          handleNext={handleNextQuestion}
          handlePrevious={handlePreviousQuestion}
          handleReadingSubmit={handleSubmit}
          handleListeningSubmit={() => {}}
          onStartPaper={handleStartPaper}
        />
      </div>
    </div>
  );
};

export default ReadingPaperPage;
