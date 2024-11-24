import React, { useEffect, useState } from "react";
import { HiOutlineSpeakerWave } from "react-icons/hi2"; // Speaker icon

// Define the type for onConfirmable prop
interface TestNotesProps {
  onConfirmable: (isConfirmable: boolean) => void; // Expecting a function that takes a boolean as an argument
}

const TestNotes: React.FC<TestNotesProps> = ({ onConfirmable }) => {
  // Track if the information has been read
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    if (isReading) {
      // Function to read text with better audio output
      const readText = (text: string) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.pitch = 1.0; // Adjust pitch (0.0 to 2.0)
        speech.rate = 1.0;  // Adjust rate (0.1 to 2.0)
        speech.volume = 1;  // Adjust volume (0.0 to 1.0)

        // Use a better voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (voice) => voice.lang === "en-US" && voice.name.includes("Google")
        ) || voices[0];
        if (preferredVoice) {
          speech.voice = preferredVoice;
        }

        window.speechSynthesis.speak(speech);
      };

      const readInformation = async () => {
        // Read Instructions
        readText(
          "You should follow all the instructions provided by the invigilator."
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay

        readText(
          "Ensure that all your test materials are on the desk before the test begins."
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay

        readText("Raise your hand if you encounter any issues during the test.");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay

        readText(
          "You must complete the test within the given time frame without interruptions."
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay

        setIsReading(false); // Mark reading as complete
        onConfirmable(true); // Enable confirm button
      };

      readInformation();
    }
  }, [isReading, onConfirmable]);

  const handleSpeakerClick = () => {
    setIsReading(true); // Start reading when the speaker icon is clicked
    onConfirmable(false); // Disable the confirm button until the reading is done
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="border border-gray-300 shadow-md p-6 rounded-lg w-4/5 md:w-3/5 lg:w-2/5">
        {/* Header Section */}
        <div className="text-center text-white font-bold bg-blue-500 py-2 rounded-md">
          Test of Proficiency in Korean(CBT)
        </div>

        {/* Instructions Section */}
        <div
          className="flex items-center mb-4 bg-gray-600 py-2 rounded-md px-4 cursor-pointer"
          onClick={handleSpeakerClick}
        >
          <HiOutlineSpeakerWave className="text-2xl mr-2 text-white" />
          <span className="text-white text-sm">
            After checking there is nothing wrong, press the Ready Button
          </span>
        </div>

        {/* Notice List Section */}
        <ul className="list-disc text-sm pl-6 text-gray-700">
          <li className="my-2">
            You should follow all the instructions provided by the invigilator.
          </li>
          <li className="my-2">
            Ensure that all your test materials are on the desk before the test begins.
          </li>
          <li className="my-2">
            Raise your hand if you encounter any issues during the test.
          </li>
          <li className="my-2">
            You must complete the test within the given time frame without interruptions.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TestNotes;
