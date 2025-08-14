import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleSelector() {
  const [selected, setSelected] = useState("student");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selected === "student") navigate("/student");
    else navigate("/teacher");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <span className="px-4 py-1 rounded-full bg-purple-200 text-purple-700 text-sm font-medium mb-6 mt-4">
        ✨ Intervue Poll
      </span>
      <h1 className="text-3xl font-bold mb-2 text-center">
        Welcome to the <span className="font-extrabold">Live Polling System</span>
      </h1>
      <p className="text-gray-500 mb-8 text-center max-w-xl">
        Please select the role that best describes you to begin using the live polling system
      </p>
      <div className="flex gap-6 mb-8">
        <div
          className={`border-2 rounded-lg p-6 w-64 cursor-pointer transition-all ${selected === 'student' ? 'border-purple-500 shadow-md' : 'border-gray-200'}`}
          onClick={() => setSelected("student")}
        >
          <h2 className="font-bold text-lg mb-2">I’m a Student</h2>
          <p className="text-gray-500 text-sm">Participate in polls and submit your answers.</p>
        </div>
        <div
          className={`border-2 rounded-lg p-6 w-64 cursor-pointer transition-all ${selected === 'teacher' ? 'border-purple-500 shadow-md' : 'border-gray-200'}`}
          onClick={() => setSelected("teacher")}
        >
          <h2 className="font-bold text-lg mb-2">I’m a Teacher</h2>
          <p className="text-gray-500 text-sm">Submit questions and view live poll results in real-time.</p>
        </div>
      </div>
      <button
        className="bg-gradient-to-r from-purple-500 to-blue-400 text-white px-16 py-3 rounded-full text-lg font-semibold shadow-md hover:from-purple-600 hover:to-blue-500 transition"
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
}
