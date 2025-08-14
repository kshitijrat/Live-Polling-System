import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function PollHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  api.get("/history")
    .then(res => {
      // Ensure history is always an array
      const polls = Array.isArray(res.data) ? res.data : res.data.data || [];
      setHistory(polls);
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, []);


  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">View <span className="font-extrabold">Poll History</span></h1>
        <button
          className="bg-purple-200 text-purple-700 px-6 py-2 rounded-full font-semibold shadow hover:bg-purple-300"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>
      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : history.length === 0 ? (
        <div className="text-center text-lg">No poll history found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((poll, idx) => {
            // Calculate results as percentages
            const total = poll.answers.length || 1;
            const counts = poll.options.map((_, i) =>
              poll.answers.filter((a) => a.optionIndex === i).length
            );
            const results = counts.map((c) => Math.round((c / total) * 100));
            const date = poll.endedAt ? new Date(poll.endedAt) : null;
            return (
              <div key={poll._id || idx} className="bg-white rounded-xl shadow p-6 flex flex-col gap-3 border hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{date ? date.toLocaleString() : ""}</span>
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">Poll #{history.length - idx}</span>
                </div>
                <div className="font-semibold text-lg mb-1 truncate" title={poll.question}>{poll.question}</div>
                <div className="space-y-2">
                  {poll.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-500 text-white font-bold">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1 truncate" title={opt.text}>{opt.text}</span>
                      <span className="text-sm font-semibold text-gray-700">{results[i]}%</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-400 h-2 rounded-full transition-all"
                          style={{ width: `${results[i]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 