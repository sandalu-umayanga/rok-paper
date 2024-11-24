"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Image from 'next/image';

// Generate random scores for 100 papers
const generateRandomScores = () => {
  return Array.from({ length: 100 }, (_, index) => ({
    name: `Paper ${index + 1}`,
    averageScore: Math.floor(Math.random() * 200) + 1, // Random score between 1 and 100
    averageCompletionTime: Math.floor(Math.random() * 25) + 1 // Random completion time in minutes
  }));
};

const data = generateRandomScores();

const ScoreChartTeacher = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [averageStudentScore, setAverageStudentScore] = useState(0);
  const [averageStudentCompletionTime, setAverageStudentCompletionTime] = useState(0);

  // Toggle Full-Screen Mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Calculate Average Marks and Completion Time
  useEffect(() => {
    const totalStudentScore = data.reduce((sum, item) => sum + item.averageScore, 0);
    const totalStudentTime = data.reduce((sum, item) => sum + item.averageCompletionTime, 0);
    const avgScore = totalStudentScore / data.length;
    const avgTime = totalStudentTime / data.length;

    setAverageStudentScore(avgScore.toFixed(2));
    setAverageStudentCompletionTime(avgTime.toFixed(2));

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
            dataKey="averageScore"
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
          <h2 className='text-md font-semibold'>Average Student Mark</h2>
          <p>{averageStudentScore}</p>
        </div>
        <div className='flex flex-col items-center'>
          <h2 className='text-md font-semibold'>Average Completion Time</h2>
          <p>{averageStudentCompletionTime} mins</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreChartTeacher;
