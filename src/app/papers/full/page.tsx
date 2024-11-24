"use client";

import React, { useState, useEffect } from "react";
import QuestionPaper from "../components/QuestionPaper";
import { useRouter } from "next/navigation";
import MarkSheetFull from "../components/MarkSheetFull";

const FullPaperPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(40).fill(null)); // 40 questions
  const [isReadingPhase, setIsReadingPhase] = useState(true);
  const [isPaperStarted, setIsPaperStarted] = useState(false);
  const [audioStopped, setAudioStopped] = useState(false); // To control audio playback for listening
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0);
  const [timeTakenPerQuestion, setTimeTakenPerQuestion] = useState<number[]>(Array(40).fill(0));
  const [paperId, setPaperId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPaperId = localStorage.getItem("currentPaperNo");
      setPaperId(storedPaperId);
    }
  }, []);

  const handleStartPaper = () => {
    setIsPaperStarted(true);
  };

  const handleAnswerSelect = (questionIndex: number, answer: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = answer;
    setAnswers(updatedAnswers);
    localStorage.setItem("answers", JSON.stringify(updatedAnswers)); // Save answers to localStorage
  };

  // const handleNextQuestion = () => {
  //   const nextQuestion = currentQuestion + 1;
  //   if (nextQuestion < (isReadingPhase ? 20 : 40)) {
  //     saveTimeTaken();
  //     setCurrentQuestion(nextQuestion);
  //     resetQuestionTimer(nextQuestion);
  //     localStorage.setItem("currentQuestion", nextQuestion.toString()); // Save current question to localStorage
  //   }
  // };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < 40) {
      saveTimeTaken();
      setCurrentQuestion(nextQuestion);
      resetQuestionTimer(nextQuestion);
      localStorage.setItem("currentQuestion", nextQuestion.toString()); // Save current question to localStorage
    }
  };

  const saveTimeTaken = () => {
    const updatedTimeTaken = [...timeTakenPerQuestion];
    const questions = JSON.parse(localStorage.getItem("questions") || "[]");
    const allocatedTime = questions[currentQuestion]?.timeAllocated || 0;
    updatedTimeTaken[currentQuestion] += allocatedTime - questionTimeLeft;
    setTimeTakenPerQuestion(updatedTimeTaken);
  };

  const resetQuestionTimer = (questionIndex: number) => {
    const questions = JSON.parse(localStorage.getItem("questions") || "[]");
    const allocatedTime = questions[questionIndex]?.timeAllocated || 0;
    setQuestionTimeLeft(allocatedTime);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > (isReadingPhase ? 0 : 20)) {
      setCurrentQuestion(currentQuestion - 1);
      localStorage.setItem("currentQuestion", (currentQuestion - 1).toString()); // Save current question to localStorage
    }
  };

  const handleQuestionSelect = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
  };


  const handleReadingSubmit = () => {
    const readingAnswers = answers.slice(0, 20).map((answer) => (answer === null ? "null" : answer));
    console.log("Reading answers:", readingAnswers);
    saveTimeTaken();
    setIsReadingPhase(false);
    setCurrentQuestion(20); // Start with listening questions at index 20
    resetQuestionTimer(20);
    setAudioStopped(false); // Allow audio to play for the listening phase
    localStorage.setItem("currentQuestion", "20"); // Save phase transition
  };

  const handleListeningSubmit = async () => {
    saveTimeTaken();
    const totalTimeTaken = timeTakenPerQuestion.reduce((acc, time) => acc + time, 0);
    
    // if (answers.slice(20).includes(null)) {
    //   alert("Please answer all listening questions before submitting.");
    //   return;
    // }

    const readingAnswers = answers.slice(0, 20);
    const listeningAnswers = answers.slice(20);
    const combinedAnswers = [...readingAnswers, ...listeningAnswers].map((answer, index) => ({
      questionId: index + 1,
      answer: answer ?? 0, // Default to 0 if no answer was selected
    }));

    const submitPayload = {
      paperId: paperId,
      answers: combinedAnswers,
      timeTaken: totalTimeTaken,
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
        localStorage.setItem("score", result.score);
        localStorage.setItem("timeTaken", result.time);
        localStorage.removeItem("currentQuestion"); // Clear current question
        // localStorage.removeItem("answers"); // Clear answers after submission
        router.push("/papers/view-results"); // Navigate to results page
      } else {
        console.error("Failed to submit marks");
      }
    } catch (error) {
      console.error("Error submitting marks:", error);
    }

    setAudioStopped(true); // Stop all audio playback
  };

  // useEffect(() => {
  //   if (!isReadingPhase && questionTimeLeft > 0) {
  //     const timer = setTimeout(() => {
  //       setQuestionTimeLeft((prev) => prev - 1);
  //     }, 1000);

  //     // if (questionTimeLeft === 1 && currentQuestion === 39) {
  //     //   handleListeningSubmit(); // Automatically submit answers for the last question
  //     // } else if (questionTimeLeft === 0) {
  //     //   handleNextQuestion(); // Automatically navigate to the next question
  //     // }
  //     if (questionTimeLeft === 0) {
  //       if (currentQuestion === 39) {
  //         handleListeningSubmit(); // Automatically submit answers for the last question
  //       } else {
  //         handleNextQuestion(); // Automatically navigate to the next question
  //       }
  //     }

  //     return () => clearTimeout(timer);
  //   }
  // }, [questionTimeLeft, currentQuestion, isReadingPhase]);

  useEffect(() => {
    if (!isReadingPhase && questionTimeLeft > 0) {
      const timer = setTimeout(() => {
        setQuestionTimeLeft((prev) => prev - 1);
      }, 1000);
  
      return () => clearTimeout(timer); // Clear the timer on unmount or state change
    } else if (!isReadingPhase && questionTimeLeft === 0) {
      if (currentQuestion === 39) {
        handleListeningSubmit(); // Automatically submit answers for the last question
      } else {
        handleNextQuestion(); // Automatically navigate to the next question
      }
    }
  }, [questionTimeLeft, currentQuestion, isReadingPhase]);

  useEffect(() => {
    const savedAnswers = localStorage.getItem("answers");
    const savedQuestion = localStorage.getItem("currentQuestion");
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedQuestion) setCurrentQuestion(parseInt(savedQuestion, 10));
  }, []);

  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
    localStorage.setItem("currentQuestion", currentQuestion.toString());
  }, [answers, currentQuestion]);

  return (
    <div className="flex flex-col md:flex-row md:space-x-4">
      {/* Center QuestionPaper Component */}
      <div className="flex items-center justify-center w-full md:w-3/4">
        {isPaperStarted && (
          <QuestionPaper
            currentQuestion={currentQuestion}
            selectedAnswer={answers[currentQuestion]}
            onAnswerSelect={handleAnswerSelect}
            audioStopped={audioStopped}
            questionTimeLeft={questionTimeLeft}
            isReadingPhase={isReadingPhase}
          />
        )}
      </div>
  
      {/* MarkSheetFull Component */}
      <div className="w-full md:w-1/4 mt-4 md:mt-0">
        <MarkSheetFull
          currentQuestion={currentQuestion}
          answers={answers}
          isReadingPhase={isReadingPhase}
          handleNext={handleNextQuestion}
          handlePrevious={handlePreviousQuestion}
          handleQuestionSelect={handleQuestionSelect}
          handleReadingSubmit={handleReadingSubmit}
          handleListeningSubmit={handleListeningSubmit}
          onStartPaper={handleStartPaper}
          onStopAudio={() => setAudioStopped(true)}
        />
      </div>
    </div>
  );
}  

export default FullPaperPage;
