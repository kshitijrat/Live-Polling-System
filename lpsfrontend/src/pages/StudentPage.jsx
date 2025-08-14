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
  const [pollState, setPollState] = useState("waiting");
  const [pollData, setPollData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(0);
  const [results, setResults] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pollHistoryButton = location.pathname !== "/history" && (
    <button
      className="fixed top-4 right-4 sm:top-8 sm:right-8 bg-gradient-to-r from-purple-400 to-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium shadow hover:from-purple-500 hover:to-blue-600 z-50 text-sm sm:text-base"
      onClick={() => navigate("/history")}
    >
      View Poll History
    </button>
  );

  const handleContinue = () => {
    if (input.trim()) {
      sessionStorage.setItem("studentName", input.trim());
      setStudentName(input.trim());
    }
  };

  useEffect(() => {
    if (!studentName) return;
    socket.emit("get_current_poll");
    socket.on("poll_started", (data) => {
      setPollData(data);
      setPollState("active");
      setSelected(null);
      setTimer(data.duration || 60);
      setHasSubmitted(false);
    });
    socket.on("poll_ended", (data) => {
      setPollData(data);
      setPollState("result");
      const total = data.answers.length || 1;
      const counts = data.options.map((_, i) =>
        data.answers.filter((a) => a.optionIndex === i).length
      );
      setResults(counts.map((c) => Math.round((c / total) * 100)));
    });
    socket.on("poll_update", (data) => setPollData(data));
    return () => {
      socket.off("poll_started");
      socket.off("poll_ended");
      socket.off("poll_update");
    };
  }, [studentName]);

  useEffect(() => {
    let interval;
    if (pollState === "active" && pollData?.createdAt && pollData?.duration) {
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
        if (t <= 0) clearInterval(interval);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pollState, pollData]);

  const handleSubmit = () => {
    if (selected !== null && pollData && !hasSubmitted) {
      socket.emit("submit_answer", { studentName, optionIndex: selected });
      setHasSubmitted(true);
    }
  };

  // Name Entry UI
  if (!studentName) {
    return (
      <>
        {pollHistoryButton}
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
          <span className="px-4 py-1 rounded-full bg-purple-200 text-purple-700 text-sm font-medium mb-6 mt-4">
            ✨ Intervue Poll
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
            Let's <span className="font-extrabold">Get Started</span>
          </h1>
          <p className="text-gray-500 mb-8 text-center max-w-md sm:max-w-xl text-sm sm:text-base">
            Enter your name to participate in live polls and submit your answers.
          </p>
          <div className="w-full max-w-md flex flex-col gap-4">
            <input
              className="border rounded px-3 py-2 w-full sm:px-4 sm:py-3 bg-gray-100 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-300"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Your Name"
            />
            <button
              className="w-full bg-gradient-to-r from-purple-500 to-blue-400 text-white px-4 py-3 rounded-full font-semibold shadow-md hover:from-purple-600 hover:to-blue-500 transition text-sm sm:text-base"
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center gap-4">
          <svg className="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-purple-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <h2 className="text-lg sm:text-2xl font-semibold">
            Waiting for the teacher to start the poll...
          </h2>
        </div>
      </>
    );
  }

  // Active Poll
  if (pollState === "active") {
    return (
      <>
        {pollHistoryButton}
        <div className="relative px-4 sm:px-6">
          <ActivePoll
            questionNumber={1}
            timer={timer}
            question={pollData.question}
            options={pollData.options.map((opt) => opt.text)}
            selected={selected}
            onSelect={setSelected}
            onSubmit={handleSubmit}
            userType="student"
          />
          {hasSubmitted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-10 px-4 text-center">
              <span className="text-base sm:text-lg font-semibold text-purple-700">
                Answer submitted! Waiting for results...
              </span>
            </div>
          )}
        </div>
      </>
    );
  }

  // Poll Result
  if (pollState === "result") {
    return (
      <>
        {pollHistoryButton}
        <div className="px-4 sm:px-6">
          <PollResult
            questionNumber={1}
            timer={timer}
            question={pollData.question}
            options={pollData.options.map((opt) => opt.text)}
            results={results}
            userType="student"
            message="Wait for the teacher to ask a new question.."
          />
        </div>
      </>
    );
  }

  return null;
}
