import React, { useEffect, useState } from "react";
import { HiOutlineSpeakerWave } from "react-icons/hi2"; // Speaker icon

interface ApplicationNotesProps {
    onConfirmable: (isConfirmable: boolean) => void; // Expecting a function that takes a boolean as an argument
  }

const ApplicationNotes: React.FC<ApplicationNotesProps> = ({ onConfirmable }) => {
    // Track if the information has been read
    const [isReading, setIsReading] = useState(false);

    useEffect(() => {
        if (isReading) {
            // Function to read text with better audio output
            const readText = (text : string) => {
                const speech = new SpeechSynthesisUtterance(text);
                speech.lang = "en-US";
                speech.pitch = 1.0; // Adjust pitch (0.0 to 2.0)
                speech.rate = 1.0;  // Adjust rate (0.1 to 2.0)
                speech.volume = 1;  // Adjust volume (0.0 to 1.0)
                
                // Use a better voice if available
                const voices = window.speechSynthesis.getVoices();
                const preferredVoice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes("Google")) || voices[0];
                if (preferredVoice) {
                    speech.voice = preferredVoice;
                }

                window.speechSynthesis.speak(speech);
            };

            const readInformation = async () => {
                // Read Instructions
                readText("You should organize all your belongings below your desk except test identification, ID card (passport).");
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

                readText("Electronic devices, such as cell phone, camera etc. is not allowed to possess and use. Please hand in to supervisor.");
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

                readText("If there is a technical problem of the computer during the test, please raise your hand quietly without making any noise. If need arises, you can move to another PC and continue your test from where you left off.");
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

                readText("This test will be conducted for 70 minutes without a break. It has 50 questions. The reading test is from questions 1 to 25, and the listening test is from 26 to 50. Listening test will be played two times.");  // Read each digit separated by a comma
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

                readText("Once you choose an answer, you can’t change it. Please mark your answer carefully.");
                await new Promise(resolve => setTimeout(resolve, 1000));

                readText("In case of cheating, the test will be void, and examinees will NOT be eligible to take the EPS-TOPIK for 2 years.");
                await new Promise(resolve => setTimeout(resolve, 1000));


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
                    Notice of applicant
                </div>

                {/* Instructions Section */}
                <div className="flex items-center mb-4 bg-gray-600 py-2 rounded-md px-4 cursor-pointer" onClick={handleSpeakerClick}>
                    <HiOutlineSpeakerWave className="text-2xl mr-2 text-white" />
                    <span className="text-white text-sm">
                        After being fully aware of applicant notice below, click the [Confirm] button.
                    </span>
                </div>

                {/* Notice List Section */}
                <ul className="list-disc text-sm pl-6 text-gray-700">
                    <li className="my-2">
                        You should organize all your belongings below your desk except test identification, ID card (passport).
                    </li>
                    <li className="my-2">
                        <strong>Electronic device</strong> such as cell phone, camera etc. is not allowed to possess and use. Please hand in to supervisor.
                    </li>
                    <li className="my-2">
                        If there is a <strong>technical problem</strong> of the computer during the test, please raise your hand quietly without making any noise. If need arises, you can move to another PC and continue your test from where you left off.
                    </li>
                    <li className="my-2">
                        This test will be conducted for <strong>70 minutes without a break</strong>. It has 50 questions. The reading test is from questions 1 to 25, and the listening test is from 26 to 50. Listening test will be played two times.
                    </li>
                    <li className="my-2">
                        <strong>Once you choose an answer, you can’t change it.</strong> Please mark your answer carefully.
                    </li>
                    <li className="my-2">
                        <strong>In case of cheating</strong>, the test will be void, and examinees will NOT be eligible to take the EPS-TOPIK for 2 years.
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ApplicationNotes;
