"use client"
import React, { createContext, useState, useContext, useEffect } from "react";

// Create context
const ApplicationContext = createContext();

// Context provider component
export const ApplicationProvider = ({ children }) => {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [seatNumber, setSeatNumber] = useState("");

  const generateRandomNumber = (length) => {
    return Math.floor(
      Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1))
    ).toString();
  };

  useEffect(() => {
    // Set the application number and seat number when the component mounts
    setApplicationNumber(generateRandomNumber(8));
    setSeatNumber(generateRandomNumber(2));
  }, []);

  return (
    <ApplicationContext.Provider value={{ applicationNumber, seatNumber }}>
      {children}
    </ApplicationContext.Provider>
  );
};

// Custom hook to use the ApplicationContext
export const useApplicationContext = () => useContext(ApplicationContext);
