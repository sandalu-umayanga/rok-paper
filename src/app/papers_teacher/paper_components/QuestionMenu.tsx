import React from "react";

interface QuestionsMenuProps {
  paperType: string;
  selectedQuestion: number;
  setSelectedQuestion: (questionNumber: number) => void;
}

const QuestionsMenu: React.FC<QuestionsMenuProps> = ({ paperType, selectedQuestion, setSelectedQuestion }) => {
  const totalQuestions = paperType === "FULL" ? 40 : 20;

  return (
    <div className="flex flex-col w-full lg:w-1/4">
      <h2 className="font-semibold mb-2">Questions</h2>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: totalQuestions }, (_, index) => (
          <button
            key={index}
            className={`p-2 rounded-full ${selectedQuestion === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setSelectedQuestion(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionsMenu;
