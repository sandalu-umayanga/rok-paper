"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link"; // Import Link from Next.js
import InformationCheck from "../components/InformationCheck";
import ApplicationNotes from "../components/ApplicationNotes";
import TestNotes from "../components/TestNotes"; // New TestNotes component

const PaperFormat = () => {
  const [step, setStep] = useState("informationCheck");
  const [isConfirmable, setConfirmable] = useState(false);
  const [paperType, setPaperType] = useState<string>("");

  // On mount, retrieve the paper type from localStorage (or another source)
  useEffect(() => {
    const savedPaperType = localStorage.getItem("currentPaperType") || "full";
    setPaperType(savedPaperType);
  }, []);

  const handleNextStep = () => {
    setStep((prevStep) =>
      prevStep === "informationCheck"
        ? "applicationNotes"
        : prevStep === "applicationNotes"
        ? "testNotes"
        : prevStep
    );
    setConfirmable(false); // Reset confirm button state on each step change
  };

  // Dynamically set the link based on the paper type
  const getPaperLink = () => {
    if (paperType === "READING") {
      return "/papers/reading";
    } else if (paperType === "LISTENING") {
      return "/papers/listening";
    } else {
      return "/papers/full"; // Default to full if no type is found
    }
  };

  return (
    <div className="flex flex-col mt-12">
      {step === "informationCheck" && (
        <InformationCheck onConfirmable={setConfirmable} />
      )}
      {step === "applicationNotes" && (
        <ApplicationNotes onConfirmable={setConfirmable} />
      )}
      {step === "testNotes" && <TestNotes onConfirmable={setConfirmable} />}

      <div className="flex justify-center mt-4">
        {step === "testNotes" ? (
          // Use Link for internal navigation when step is "testNotes"
          <Link href={getPaperLink()}>
            <button
              className={`text-white px-4 py-2 rounded-md font-semibold transition-all duration-300 ${
                isConfirmable
                  ? "bg-blue-500 hover:bg-orange-500"
                  : "bg-gray-300 cursor-not-allowed opacity-50"
              }`}
              disabled={!isConfirmable}
              onClick={() => {
                // localStorage.removeItem("currentPaperType");
              }}
            >
              Ready
            </button>
          </Link>
        ) : (
          <button
            onClick={handleNextStep}
            disabled={!isConfirmable}
            className={`text-white px-4 py-2 rounded-md font-semibold transition-all duration-300 ${
              isConfirmable
                ? "bg-blue-500 hover:bg-orange-500"
                : "bg-gray-300 cursor-not-allowed opacity-50"
            }`}
          >
            Confirm
          </button>
        )}
      </div>
    </div>
  );
};

export default PaperFormat;
