"use client"

import React, { useEffect, useMemo, useState } from 'react'
import PaperIDInput from '../paper_components/PaperIDInput'
import PaperTypeDropdown from '../paper_components/PaperTypeDropdown'
import QuestionDetails from '../paper_components/QuestionDetails'
import QuestionsMenu from '../paper_components/QuestionMenu'
import ViewQuestionModal from '../paper_components/ViewQuestionModal'
import DiscussionLinkInput from '../paper_components/DiscussionLinkInput'
import { useSearchParams } from 'next/navigation'

{/* ----------------------- Change one ----------------------- */}
import Error from '@/components/Error'


interface QuestionData {
  question_id: number;
  questionType: string;
  questionText: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  correctAnswer: number;
}

interface QuestionDetails {
  paper_id: string;
  question_id: number;
  questionType: string;
  questionText: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  correctAnswer: number;
  mediaLink?: string;
}

const AddPaper_1 = () => {
  const getToken = () => localStorage.getItem('authToken') || '';

  const searchParams = useSearchParams();
  const paperNo = searchParams.get('paperNo') || ""; 
  const [paperID, setPaperID] = useState(paperNo); 
  const [paperType, setPaperType] = useState("READING");
  const [discussionLink, setDiscussionLink] = useState("");
  const [isPaperSubmitted, setIsPaperSubmitted] = useState(false);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestionData, setCurrentQuestionData] = useState<QuestionData | null>(null);
  const [existingQuestionData, setExistingQuestionData] = useState<QuestionData | null>(null);

  const emptyQuestionData = useMemo(
    () => ({
      question_id: 0,
      questionType: '',
      questionText: '',
      answer1: '',
      answer2: '',
      answer3: '',
      answer4: '',
      correctAnswer: 1,
    }),
    []
  );



  {/* ----------------------- Change one ----------------------- */}
  const [showError, setShowError] = useState(false);

  const handleerror = () => {
    setShowError(true);
    setTimeout(() => {
      setShowError(false); 
    }, 3000);
  };






  useEffect(() => {
    const checkPaperSubmission = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/papers/checkPaper?paper_id=${paperID}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setIsPaperSubmitted(true);
          setPaperType(data.paperType.toUpperCase());
          setDiscussionLink(data.discussionLink);

          setQuestions(data.questions || []);
        } else if (response.status === 403) {
          alert("Unauthorized access");
        }
      } catch (error) {
        console.error("Error checking paper submission:", error);
      }
    };

    if (paperID) {
      checkPaperSubmission();
    }
  }, [paperID]);

  useEffect(() => {
  }, [paperType]);

  // Fetch existing question details when a new question is selected
  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/papers/getQuestion?paper_id=${paperID}&question_id=${selectedQuestion}`,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
  
        if (response.ok) {
          const data = await response.json();
          setExistingQuestionData(data);
        } else {
          setExistingQuestionData(emptyQuestionData); // Reset to empty if no data is found
        }
      } catch (error) {
        console.error("Error fetching question details:", error);
        setExistingQuestionData(emptyQuestionData); // Reset to empty in case of an error
      }
    };
  
    if (selectedQuestion && isPaperSubmitted) {
      fetchQuestionDetails();
    }
  }, [selectedQuestion, paperID, isPaperSubmitted, emptyQuestionData]);


  const handleSubmitPaper = async () => {


    if (paperID.trim() && paperType && discussionLink.trim()) {
      const response = await fetch(`http://localhost:8080/api/v1/papers/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ 
          paper_id: paperID, 
          paperType: paperType.toUpperCase(),
          discussionLink 
        }),
      });
      if (response.ok) {
        setIsPaperSubmitted(true);
      } else {
        console.error("Failed to submit paper");
      }
    } else {

      {/*----------------------  Change one ----------------------*/}
      

      handleerror()

    }
  };

  const handleViewQuestion = async (questionId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/papers/viewQuestion`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          paper_id: paperID,
          question_id: questionId,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setCurrentQuestionData(data);
        setIsModalOpen(true);
      } else if (response.status === 403) {
        console.error("Unauthorized access");
        alert("Unauthorized access");
      } else {
        console.error("Failed to view question");
        alert("Failed to view question");
      }
    } catch (error) {
      console.error("Error viewing question:", error);
    }
  };

  const handleSubmitQuestion = async (questionDetails: FormData) => {
    const endpoint = questions && questions.some(q => q.question_id === parseInt(questionDetails.get('question_id') as string))
      ? 'http://localhost:8080/api/v1/papers/editQuestion'
      : 'http://localhost:8080/api/v1/papers/addQuestion';


    const token = getToken();
    if (!token) {
        console.error("Authorization token is missing");
    } else {
      alert ("Authorization token is missing");
    }

    // Check FormData entries
    // console.log("FormData entries before submission:");
    // for (let [key, value] of questionDetails.entries()) {
    //     console.log(`${key}:`, value);
    // }

    try {
      const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${token}`
          },
          body: questionDetails
      });

      // console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
          console.error(`Failed to submit question. Status: ${response.status}`);
          const errorData = await response.json();
          console.error("Error details:", errorData);
          return;
      }

      const data = await response.json();
      // console.log("Received response from question submission:", data);

      setQuestions(prev => [...prev.filter(q => q.question_id !== data.question_id), data]);
  } catch (error) {
      console.error("Error submitting question:", error);
  }
};

  const handleDeleteQuestion = async (questionId: number) => {
    // console.log(`Requesting to delete question with paper ID: ${paperID} and question ID: ${questionId}`);
    const response = await fetch(`http://localhost:8080/api/v1/papers/deleteQuestion?paper_id=${paperID}&question_id=${questionId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (response.ok) {
      // console.log("Question deleted successfully");
      setQuestions(prev => prev.filter(q => q.question_id !== questionId));
    } else {
      console.error("Failed to delete question");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Add New Paper</h1>
      <div className="flex gap-4 flex-wrap">
        <PaperIDInput value={paperID} setValue={() => {}} disabled={true} />
        <PaperTypeDropdown value={paperType} setValue={setPaperType} disabled={isPaperSubmitted} />
        <DiscussionLinkInput value={discussionLink} setValue={setDiscussionLink} disabled={isPaperSubmitted} />
        {!isPaperSubmitted && (
          <div className="w-full flex justify-end mt-2">
            <button onClick={handleSubmitPaper} className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm">
              Submit Paper
            </button>
            {showError && (
            <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 text-center flex items-center justify-center">
              <Error message="Please fill out all fields." />
            </div>
      )}
          </div>     
        )}
      </div>


      {isPaperSubmitted && (
        <div className="flex flex-wrap lg:flex-nowrap gap-8 mt-6">
          <QuestionsMenu
            paperType={paperType}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
          />
          <QuestionDetails
            paperType={paperType}
            questionNumber={selectedQuestion}
            paperID={paperID}
            onView={() => handleViewQuestion(selectedQuestion)}
            onSubmit={handleSubmitQuestion}
            onDelete={handleDeleteQuestion}
            existingQuestionData={existingQuestionData}
          />
        </div>
      )}

      {isModalOpen && currentQuestionData && (
        <ViewQuestionModal
          questionData={currentQuestionData}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      
    </div>

  );
};

export default AddPaper_1;
