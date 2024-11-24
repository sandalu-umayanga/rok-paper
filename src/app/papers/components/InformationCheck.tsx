"use client";

import React, { useState, useEffect } from "react";
import { useApplicationContext } from "./ApplicationContext";
import { FaUserAlt } from "react-icons/fa"; // Placeholder for user portrait
import { HiOutlineSpeakerWave } from "react-icons/hi2"; // Speaker icon for instruction
import Image from "next/image";

interface InformationCheckProps {
  onConfirmable: (isConfirmable: boolean) => void; // Expecting a function that takes a boolean as an argument
}

const InformationCheck: React.FC<InformationCheckProps> = ({
  onConfirmable,
}) => {
  const { applicationNumber, seatNumber } = useApplicationContext();

  // Track if the information has been read
  const [isReading, setIsReading] = useState(false);

  // Store student details
  const [studentDetails, setStudentDetails] = useState({
    firstName: "",
    lastName: "",
    profileImageLink: null as string | null,
  });

  // Fetch student details from API
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:8080/api/v1/student/details", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStudentDetails(data);
        } else {
          console.error("Failed to fetch student details");
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    fetchStudentDetails();
  }, []);

  useEffect(() => {
    if (isReading) {
      const readText = (text: string) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.pitch = 1.0;
        speech.rate = 1.0;
        speech.volume = 1;

        const setVoice = () => {
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice =
            voices.find(
              (voice) => voice.lang === "en-US" && voice.name.includes("Google")
            ) || voices[0];

          if (preferredVoice) {
            speech.voice = preferredVoice;
          }
          window.speechSynthesis.speak(speech);
        };

        if (window.speechSynthesis.getVoices().length > 0) {
          setVoice();
        } else {
          window.speechSynthesis.onvoiceschanged = setVoice;
        }
      };

      const readInformation = async () => {
        readText(`Seat Number: ${seatNumber}`);
        await new Promise((resolve) => setTimeout(resolve, 2000));

        readText("Test Venue: Test Venue");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        readText("Test Room: Test Room");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const digits = applicationNumber.toString().split("");
        readText(`Application Number: ${digits.join(", ")}`);
        await new Promise((resolve) => setTimeout(resolve, 2000));

        readText(
          `Name: ${studentDetails.firstName} ${studentDetails.lastName}`
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsReading(false);
        onConfirmable(true);
      };

      readInformation();
    }
  }, [isReading, seatNumber, applicationNumber, studentDetails, onConfirmable]);

  const handleSpeakerClick = () => {
    setIsReading(true); // Start reading when the speaker icon is clicked
    onConfirmable(false); // Disable the confirm button until the reading is done
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="border border-gray-300 shadow-md p-6 rounded-lg w-4/5 md:w-3/5 lg:w-2/5">
        {/* Header Section */}
        <div className="text-center text-white font-bold bg-blue-500 py-2 rounded-md">
          Information check of applicant
        </div>

        {/* Instructions Section */}
        <div
          className="flex items-center mb-2 bg-gray-600 py-2 rounded-md px-4 cursor-pointer"
          onClick={handleSpeakerClick}
        >
          <HiOutlineSpeakerWave className="text-2xl mr-2 text-white" />
          <span className="text-white text-sm">
            Check your application and if there is no problem, click the
            [Confirm] button.
          </span>
        </div>

        {/* Information Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Section: Seat Number and Portrait */}
          <div className="flex flex-col items-center">
            <span className="text-gray-600">Seat Number</span>
            <span className="text-7xl font-bold mt-2">{seatNumber}</span>
            <div className="mt-4 w-32 h-32 border border-gray-400 rounded-lg flex items-center justify-center overflow-hidden">
              {studentDetails.profileImageLink ? (
                <Image
                src={studentDetails.profileImageLink}
                alt="Profile"
                width={128} // Optimize image size for layout
                height={128}
                className="rounded-lg object-cover"
              />
              ) : (
                <FaUserAlt className="text-gray-400 text-6xl" />
              )}
            </div>
          </div>

          {/* Right Section: Applicant Details */}
          <div className="flex flex-col justify-center gap-3">
            <div className="flex items-center">
              <span className="w-28 text-sm font-semibold text-white bg-blue-500 px-2 py-1 rounded-md text-center">
                SEAT NO.
              </span>
              <span className="border border-gray-300 px-3 py-2 text-sm bg-gray-100 flex-grow text-center rounded-md">
                {seatNumber}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-28 text-sm font-semibold text-white bg-blue-500 px-2 py-1 rounded-md text-center">
                TEST VENUE
              </span>
              <span className="border border-gray-300 px-3 py-2 text-sm bg-gray-100 flex-grow text-center rounded-md">
                Test Venue
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-28 text-sm font-semibold text-white bg-blue-500 px-2 py-1 rounded-md text-center">
                TEST ROOM
              </span>
              <span className="border border-gray-300 px-3 py-2 text-sm bg-gray-100 flex-grow text-center rounded-md">
                Test Room
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-28 text-sm font-semibold text-white bg-blue-500 px-2 py-1 rounded-md text-center">
                APPLICATION NO.
              </span>
              <span className="border border-gray-300 px-3 py-2 text-sm bg-gray-100 flex-grow text-center rounded-md">
                {applicationNumber}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-28 text-sm font-semibold text-white bg-blue-500 px-2 py-1 rounded-md text-center">
                NAME
              </span>
              <span className="border border-gray-300 px-3 py-2 text-sm bg-gray-100 flex-grow text-center rounded-md">
                {studentDetails.firstName} {studentDetails.lastName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationCheck;
