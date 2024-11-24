"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Image from 'next/image';

const ScoreChart = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [data, setData] = useState([]);
  const [averageScore, setAverageScore] = useState(0);
  const [averageCompletionTime, setAverageCompletionTime] = useState("00:00");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Toggle Full-Screen Mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
    
      try {
        // Fetch Average Completion Time
        const averageTimeResponse = await fetch("http://localhost:8080/api/v1/marks/getAverageTime", {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        const avgTime = await averageTimeResponse.text();  // Get response as plain text
        // console.log("Average Completion Time (raw):", avgTime);  // Debugging statement
    
        setAverageCompletionTime(avgTime);  // Set the raw text as average completion time
      
        // Fetch Average Score
        const averageScoreResponse = await fetch("http://localhost:8080/api/v1/marks/averageMarksForStudent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const avgScore = await averageScoreResponse.json();
        // console.log("Average Score:", avgScore);  // Debugging statement
        setAverageScore(avgScore);
    
        // Fetch Marks Data
        const marksResponse = await fetch("http://localhost:8080/api/v1/marks/getMarks?paperId=1", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const marksData = await marksResponse.json();
        // console.log("Marks Data:", marksData);  // Debugging statement
    
        const chartData = marksData.map((item, index) => ({
          name: `Paper ${index + 1}`,
          Score: item.score,
        }));
        setData(chartData);
    
        // Set feedback message based on average score
        if (avgScore >= 175) {
          setFeedbackMessage("Excellent! You are doing great.");
        } else if (avgScore >= 140) {
          setFeedbackMessage("Good job! Keep up the effort.");
        } else if (avgScore >= 100) {
          setFeedbackMessage("You are doing well, but there’s room for improvement.");
        } else {
          setFeedbackMessage("Needs more work. Focus on improving.");
        }
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };;
  
    fetchData();
  }, []);

  // Dynamic point rendering based on score
  const renderDot = (dotProps) => {
    const { cx, cy, value } = dotProps;
    return (
      <circle cx={cx} cy={cy} r={6} fill={value < 100 ? 'red' : '#2445c9'} stroke="none" />
    );
  };

  return (
    <div className={`bg-white rounded-lg p-4 ${isFullScreen ? 'fixed inset-0 z-50 p-8' : 'h-full'}`}>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-semibold'>Scores</h1>
        <Image src="/moreDark.png" alt='' width={20} height={20} />
      </div>

      {/* Full-Screen Button */}
      <button
        onClick={toggleFullScreen}
        className='mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
      >
        {isFullScreen ? 'Exit Full Screen' : 'View Full Screen'}
      </button>

      <ResponsiveContainer width="100%" height={isFullScreen ? "80%" : "90%"}>
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: "#D1D5DB" }} tickMargin={10} />
          <YAxis tickMargin={10} />
          <Tooltip contentStyle={{ borderRadius: "10px", borderColor: "lightcyan" }} />
          <Legend align='center' verticalAlign='top' wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }} />
          
          {/* Line with customized dots */}
          <Line
            type="monotone"
            dataKey="Score"
            stroke="#121212"
            strokeWidth={3}
            activeDot={{ r: 8 }}
            dot={renderDot}  // Custom dot based on score value
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Horizontal Stats Section */}
      <div className='mt-6 flex justify-between items-center'>
        <div className='flex flex-col items-center'>
          <h2 className='text-md font-semibold'>Average Marks</h2>
          <p>{averageScore}</p>
        </div>
        <div className='flex flex-col items-center'>
          <h2 className='text-md font-semibold'>Average Completion Time</h2>
          <p>{averageCompletionTime} mins</p>
        </div>
      </div>

      {/* Feedback Section */}
      <div className='mt-6 text-center'>
        <h2 className='text-lg font-semibold'>{feedbackMessage}</h2>
      </div>
    </div>
  );
};

export default ScoreChart;
