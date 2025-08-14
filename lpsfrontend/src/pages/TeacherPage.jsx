import React, { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import ActivePoll from "../components/ActivePoll";
import PollResult from "../components/PollResult";
import PollForm from "../components/PollForm";
import { useNavigate, useLocation } from "react-router-dom";

export default function TeacherPage() {
  const [pollState, setPollState] = useState("waiting"); // "waiting" | "active" | "result"
  const [pollData, setPollData] = useState(null); // { question, options, duration, ... }
  const [timer, setTimer] = useState(0);
  const [results, setResults] = useState([]); // percentages
  const navigate = useNavigate();
  const location = useLocation();

  // Socket.IO listeners
  useEffect(() => {
    socket.emit("get_current_poll");
    socket.on("poll_started", (data) => {
      setPollData(data);
      setPollState("active");
      setTimer(data.duration || 60);
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
  }, []);

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

  // Handler for asking a new question (show poll creation form)
  const handleAskNewQuestion = () => {
    setPollState("waiting");
    setPollData(null);
    setResults([]);
    // Optionally show poll creation form here
  };

  // Handler for viewing poll history
  const handleViewHistory = () => {
    // Implement navigation or modal for poll history
    alert("View Poll history clicked");
  };

  // Always show poll history button (not on PollHistory page)
  const pollHistoryButton = location.pathname !== "/history" && (
    <button
      className="fixed top-8 right-8 bg-purple-200 text-purple-700 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-purple-300 z-50"
      onClick={() => navigate("/history")}
    >
      View Poll History
    </button>
  );

  // Waiting for poll: show only the poll creation form
  if (pollState === "waiting" || !pollData) {
    return <>
      {pollHistoryButton}
      <PollForm />
    </>;
  }

  // Active poll UI
  if (pollState === "active") {
    return <>
      {pollHistoryButton}
      <ActivePoll
        questionNumber={1}
        timer={timer}
        question={pollData.question}
        options={pollData.options.map(opt => opt.text)}
        userType="teacher"
        answers={pollData.answers || []}
      />
    </>;
  }

  // Poll result UI
  if (pollState === "result") {
    return <>
      {pollHistoryButton}
      <PollResult
        questionNumber={1}
        timer={timer}
        question={pollData.question}
        options={pollData.options.map(opt => opt.text)}
        results={results}
        userType="teacher"
        onAskNewQuestion={handleAskNewQuestion}
        onViewHistory={handleViewHistory}
      />
    </>;
  }

  return null;
}
