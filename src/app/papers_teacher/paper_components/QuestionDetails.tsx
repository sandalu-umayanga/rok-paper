import React, { useState, useEffect } from "react";

interface QuestionDetailsProps {
  paperType: string;
  questionNumber: number;
  paperID: string;
  onView: (questionData: any) => void;
  onSubmit: (questionData: any) => void;
  onDelete: (questionId: number) => void;
  existingQuestionData?: QuestionData | null;
}

interface QuestionData {
  questionText: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  correctAnswer: number;
}

const QuestionDetails: React.FC<QuestionDetailsProps> = ({
  paperType,
  questionNumber,
  paperID,
  onView,
  onSubmit,
  onDelete,
  existingQuestionData, // Receive the data as a prop
}) => {


  const questionType =
  paperType === "FULL"
    ? questionNumber <= 20
      ? "READING"
      : "LISTENING"
    : paperType.toUpperCase(); 

    useEffect(() => {
      // console.log("Current paperType:", paperType);
      // console.log("Determined questionType:", questionType);
    }, [paperType, questionType]);

    const [questionData, setQuestionData] = useState<QuestionData>({
      questionText: "",
      answer1: "",
      answer2: "",
      answer3: "",
      answer4: "",
      correctAnswer: 1,
    });

    const [answerFiles, setAnswerFiles] = useState<(File | undefined)[]>([undefined, undefined, undefined, undefined]);
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [timeAllocated, setTimeAllocated] = useState({ min: 0, sec: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Update question data if existingQuestionData changes (for prefilling)
    if (existingQuestionData) {
      setQuestionData(existingQuestionData);
    }
  }, [existingQuestionData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuestionData({
      ...questionData,
      [name]: name === "correctAnswer" ? parseInt(value) : value,
    });
  };

  const handleAnswerFileChange = (index: number, file: File | undefined) => {
    setAnswerFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index] = file;
      return updatedFiles;
    });
  };


  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTimeAllocated((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = questionType === "READING" && file.type.startsWith("image/");
      const isAudio = questionType === "LISTENING" && file.type.startsWith("audio/");
      if (isImage || isAudio) {
        setMediaFile(file);
      } else {
        alert(`Invalid file type. Please upload a ${questionType === "READING" ? "image" : "audio"} file.`);
      }
    } else {
      setMediaFile(null);
    }
  };

  const handleViewClick = () => {
    onView({
      question_id: questionNumber,
      questionType,
      ...questionData,
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("paper_id", paperID);
    formData.append("question_id", questionNumber.toString());
    formData.append("questionType", questionType);
    formData.append("questionText", questionData.questionText);
    formData.append("correctAnswer", questionData.correctAnswer.toString());


    // Append answers (either text or file)
    ["answer1Text", "answer2Text", "answer3Text", "answer4Text"].forEach((key, index) => {
      if (questionData[key as keyof QuestionData]) {
        formData.append(key, questionData[key as keyof QuestionData] as string);
      } else if (answerFiles[index]) {
        formData.append(`answer${index + 1}File`, answerFiles[index] as Blob);
      }
    });

    if (mediaFile) {
      formData.append("mediaFile", mediaFile);
    }

    const totalSeconds = timeAllocated.min * 60 + timeAllocated.sec;
    formData.append("timeAllocated", totalSeconds.toString());

    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }

    await onSubmit(formData);

    setIsSubmitting(false);
  };

  return (
    <div className="flex-1 space-y-4">
      <div>
        <label className="font-semibold">Question ID</label>
        <input value={questionNumber} disabled className="border p-2 rounded-md" />
      </div>
      <div>
        <label className="font-semibold">Question Type</label>
        <input value={questionType} disabled className="border p-2 rounded-md" />
      </div>
      <div>
        <label className="font-semibold">Question Text</label>
        <textarea
          name="questionText"
          value={questionData.questionText}
          onChange={handleChange}
          required
          className="border p-2 rounded-md w-full"
        />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i}>
          <label className="font-semibold">Answer {i}</label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              name={`answer${i}Text`}
              value={questionData[`answer${i}Text` as keyof QuestionData] || ""}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              placeholder="Enter text or upload file"
            />
            <input
              type="file"
              accept="image/*,audio/*"
              onChange={(e) => handleAnswerFileChange(i - 1, e.target.files?.[0])}
              className="border p-2 rounded-md"
            />
          </div>
        </div>
      ))}
      <div>
        <label className="font-semibold">Correct Answer</label>
        <input
          type="number"
          name="correctAnswer"
          value={questionData.correctAnswer}
          onChange={handleChange}
          min="1"
          max="4"
          required
          className="border p-2 rounded-md"
        />
      </div>

      {/* Conditional Time Allocated Field */}
      {(paperType === "LISTENING" || (paperType === "FULL" && questionNumber > 20)) && (
        <div>
          <label className="font-semibold">Time Allocated</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="min"
              value={timeAllocated.min}
              onChange={handleTimeChange}
              min="0"
              className="border p-2 rounded-md w-1/2"
              placeholder="Min"
            />
            <input
              type="number"
              name="sec"
              value={timeAllocated.sec}
              onChange={handleTimeChange}
              min="0"
              max="59"
              className="border p-2 rounded-md w-1/2"
              placeholder="Sec"
            />
          </div>
        </div>
      )}


      <div>
        <label className="font-semibold">Upload Media File</label>
        <input
          type="file"
          accept={questionType === "READING" ? "image/*" : "audio/*"}
          name="mediaLink"
          onChange={handleFileChange}
          className="border p-2 rounded-md"
        />
      </div>
      <div className="flex gap-4">
        <button onClick={handleViewClick} className="bg-gray-300 p-2 rounded-md">
          View Question
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting} // Disable while submitting
          className={`p-2 rounded-md ${
            isSubmitting ? "bg-gray-400 text-gray-700" : "bg-blue-500 text-white"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Question"}
        </button>
        <button onClick={() => onDelete(questionNumber)} className="bg-red-500 text-white p-2 rounded-md">
          Delete Question
        </button>
      </div>
    </div>
  );
};

export default QuestionDetails;
