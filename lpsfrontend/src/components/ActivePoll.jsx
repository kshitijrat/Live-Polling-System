import React from "react";

export default function ActivePoll({
  questionNumber = 1,
  timer = 0,
  question = "",
  options = [],
  selected = null,
  onSelect,
  onSubmit,
  userType = "student", // "student" or "teacher"
  answers = [], // array of { studentName, optionIndex, answeredAt }
}) {
  // Compute answer counts for each option if teacher
  const answerCounts = userType === "teacher"
    ? options.map((_, idx) => answers.filter(a => a.optionIndex === idx).length)
    : [];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-xl">
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
        <div className="rounded-lg overflow-hidden border mb-6">
          <div className="bg-gray-800 text-white px-4 py-3 font-semibold">
            {question}
          </div>
          <div className="p-4 space-y-3">
            {options.map((opt, idx) => (
              <div
                key={idx}
                className={`flex items-center px-4 py-3 rounded-lg cursor-pointer border transition-all ${
                  selected === idx
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 bg-gray-100"
                }`}
                onClick={() => userType === "student" && onSelect && onSelect(idx)}
              >
                <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 font-bold ${
                  selected === idx ? "bg-purple-500 text-white" : "bg-gray-300 text-gray-700"
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-medium flex-1">{opt}</span>
                {userType === "teacher" && (
                  <span className="ml-4 text-sm text-gray-500 font-semibold">{answerCounts[idx]} votes</span>
                )}
              </div>
            ))}
          </div>
        </div>
        {userType === "student" && (
          <div className="flex justify-end">
            <button
              className="bg-gradient-to-r from-purple-500 to-blue-400 text-white px-10 py-3 rounded-full text-lg font-semibold shadow-md hover:from-purple-600 hover:to-blue-500 transition"
              onClick={onSubmit}
              disabled={selected === null}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 