import React, { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import ActivePoll from "../components/ActivePoll";
import PollResult from "../components/PollResult";
import { useNavigate, useLocation } from "react-router-dom";

export default function StudentPage() {
  const [studentName, setStudentName] = useState(
    sessionStorage.getItem("studentName") || ""
  );
  const [input, setInput] = useState("");
  const [pollState, setPollState] = useState("waiting"); // "waiting" | "active" | "result"
  const [pollData, setPollData] = useState(null); // { question, options, duration, ... }
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(0);
  const [results, setResults] = useState([]); // percentages
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pollHistoryButton = location.pathname !== "/history" && (
    <button
      className="fixed top-8 right-8 bg-purple-200 text-purple-700 px-6 py-3 rounded-full font-medium shadow hover:bg-purple-300 z-50"
      onClick={() => navigate("/history")}
    >
      View Poll History
    </button>
  );

  // Handle name entry
  const handleContinue = () => {
    if (input.trim()) {
      sessionStorage.setItem("studentName", input.trim());
      setStudentName(input.trim());
    }
  };

  // Socket.IO listeners
  useEffect(() => {
    if (!studentName) return;
    socket.emit("get_current_poll");
    socket.on("poll_started", (data) => {
      setPollData(data);
      setPollState("active");
      setSelected(null);
      setTimer(data.duration || 60);
      setHasSubmitted(false); // Reset on new poll
    });
    socket.on("poll_ended", (data) => {
      setPollData(data);
      setPollState("result");
      // Calculate percentages
      const total = data.answers.length || 1;
      const counts = data.options.map((_, i) =>
        data.answers.filter((a) => a.optionIndex === i).length
      );
      setResults(counts.map((c) => Math.round((c / total) * 100)));
    });
    socket.on("poll_update", (data) => {
      setPollData(data);
    });
    return () => {
      socket.off("poll_started");
      socket.off("poll_ended");
      socket.off("poll_update");
    };
  }, [studentName]);

  // Timer for active poll
  useEffect(() => {
    let interval;
    if (pollState === "active" && pollData && pollData.createdAt && pollData.duration) {
      const getTimeLeft = () => {
        const now = Date.now();
        const start = new Date(pollData.createdAt).getTime();
        const elapsed = Math.floor((now - start) / 1000);
        return Math.max(pollData.duration - elapsed, 0);
      };
      setTimer(getTimeLeft());
      interval = setInterval(() => {
        const t = getTimeLeft();
        setTimer(t);
        if (t <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pollState, pollData]);

  // Handle answer submit
  const handleSubmit = () => {
    if (selected !== null && pollData && !hasSubmitted) {
      socket.emit("submit_answer", {
        studentName,
        optionIndex: selected,
      });
      setHasSubmitted(true);
    }
  };

  // Name entry UI
  if (!studentName) {
    return (
      <>
        {pollHistoryButton}
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
          <span className="px-4 py-1 rounded-full bg-purple-200 text-purple-700 text-sm font-medium mb-6 mt-4">
            ✨ Intervue Poll
          </span>
          <h1 className="text-3xl font-bold mb-2 text-center">
            Let's <span className="font-extrabold">Get Started</span>
          </h1>
          <p className="text-gray-500 mb-8 text-center max-w-xl">
            If you're a student, you'll be able to <span className="font-semibold">submit your answers</span>, participate in live polls, and see how your responses compare with your classmates
          </p>
          <div className="w-full max-w-md flex flex-col items-center">
            <label className="mb-2 text-lg font-medium self-start">Enter your Name</label>
            <input
              className="border rounded px-3 py-2 mb-6 w-full bg-gray-100"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Your Name"
            />
            <button
              className="bg-gradient-to-r from-purple-500 to-blue-400 text-white px-16 py-3 rounded-full text-lg font-semibold shadow-md hover:from-purple-600 hover:to-blue-500 transition"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </>
    );
  }

  // Waiting for poll
  if (pollState === "waiting" || !pollData) {
    return (
      <>
        {pollHistoryButton}
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
          <span className="px-4 py-1 rounded-full bg-purple-200 text-purple-700 text-sm font-medium mb-6 mt-4">
            ✨ Intervue Poll
          </span>
          <svg className="animate-spin h-12 w-12 text-purple-500 mb-6" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <h2 className="text-2xl font-semibold text-center">Wait for the teacher to ask questions..</h2>
        </div>
      </>
    );
  }

  // Active poll UI
  if (pollState === "active") {
    return (
      <>
        {pollHistoryButton}
        <div className="relative">
          <ActivePoll
            questionNumber={1}
            timer={timer}
            question={pollData.question}
            options={pollData.options.map(opt => opt.text)}
            selected={selected}
            onSelect={setSelected}
            onSubmit={handleSubmit}
            userType="student"
          />
          {hasSubmitted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-10">
              <span className="text-lg font-semibold text-purple-700">Answer submitted! Waiting for results...</span>
            </div>
          )}
        </div>
      </>
    );
  }

  // Poll result UI
  if (pollState === "result") {
    return (
      <>
        {pollHistoryButton}
        <PollResult
          questionNumber={1}
          timer={timer}
          question={pollData.question}
          options={pollData.options.map(opt => opt.text)}
          results={results}
          userType="student"
          message="Wait for the teacher to ask a new question.."
        />
      </>
    );
  }

  return null;
} 