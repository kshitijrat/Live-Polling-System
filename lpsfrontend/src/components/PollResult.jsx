import React from "react";
import { useNavigate } from "react-router-dom";

export default function PollResult({
  questionNumber = 1,
  timer = 0,
  question = "",
  options = [],
  results = [], 
  userType = "student",
  onAskNewQuestion,
  message = "Wait for the teacher to ask a new question..",
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-xl mt-4">
        {/* Top bar */}
        <div className="flex items-center mb-4">
          <span className="font-bold text-lg mr-4">Question {questionNumber}</span>
          <span className="flex items-center text-red-500 font-semibold">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            </svg>
            00:{timer.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Question */}
        <div className="font-bold text-lg mb-2">Question</div>
        <div className="rounded-lg overflow-hidden border mb-6">
          <div className="bg-gray-800 text-white px-4 py-3 font-semibold">
            {question}
          </div>
          <div className="p-4 space-y-3">
            {options.map((opt, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex items-center mb-1">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-500 text-white font-bold mr-3">
                    {idx + 1}
                  </span>
                  <span className="font-medium">{opt}</span>
                  <span className="ml-auto font-semibold">{results[idx] || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-400 h-3 rounded-full transition-all"
                    style={{ width: `${results[idx] || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher buttons */}
        {userType === "teacher" ? (
          <div className="flex justify-between mt-6">
            <button
              className="flex items-center gap-2 px-5 py-2 bg-purple-200 text-purple-700 rounded-full font-medium"
              onClick={() => navigate("/history")} // 👈 direct navigate
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Poll history
            </button>
            <button
              className="bg-gradient-to-r from-purple-500 to-blue-400 text-white px-8 py-2 rounded-full text-lg font-semibold shadow-md hover:from-purple-600 hover:to-blue-500 transition"
              onClick={onAskNewQuestion}
            >
              + Ask a new question
            </button>
          </div>
        ) : (
          <div className="flex justify-center mt-6">
            <span className="text-lg font-semibold text-center text-gray-800">
              {message}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
