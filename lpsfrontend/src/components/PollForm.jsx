import React, { useState } from "react";
import { socket } from "../utils/socket";

export default function PollForm() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [duration, setDuration] = useState(60);

  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx].text = value;
    setOptions(newOptions);
  };

  const handleCorrectChange = (idx, value) => {
    setOptions(
      options.map((opt, i) => (i === idx ? { ...opt, isCorrect: value } : opt))
    );
  };

  const addOption = () => setOptions([...options, { text: "", isCorrect: false }]);
  const removeOption = (idx) => setOptions(options.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("create_poll", { question, options, duration });
    setQuestion("");
    setOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
    setDuration(60);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 px-2 sm:px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-4 sm:p-8 flex flex-col gap-4"
      >
        <span className="self-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs sm:text-sm font-semibold mb-2">
          ✨ Intervue Poll
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">
          Create New Poll
        </h2>
        <input
          className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm sm:text-base"
          placeholder="Enter your question here"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <div className="flex flex-col gap-2 mb-2">
          {options.map((opt, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 relative"
            >
              <input
                className="border border-gray-300 px-3 py-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm sm:text-base w-full sm:w-auto"
                placeholder={`Option ${idx + 1}`}
                value={opt.text}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                required
              />
              <div className="flex gap-2 mt-2 sm:mt-0">
                <label className="flex items-center cursor-pointer select-none text-xs sm:text-sm">
                  <input
                    type="radio"
                    checked={opt.isCorrect}
                    onChange={() => handleCorrectChange(idx, true)}
                    className="accent-green-500 w-4 h-4"
                    name={`correctOption${idx}`}
                  />
                  <span className="ml-1 text-green-700">Correct</span>
                </label>
                <label className="flex items-center cursor-pointer select-none text-xs sm:text-sm">
                  <input
                    type="radio"
                    checked={!opt.isCorrect}
                    onChange={() => handleCorrectChange(idx, false)}
                    className="accent-red-500 w-4 h-4"
                    name={`correctOption${idx}`}
                  />
                  <span className="ml-1 text-red-700">Incorrect</span>
                </label>
              </div>
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="absolute top-1 right-1 text-gray-600 hover:text-red-600 text-lg sm:text-xl font-bold px-2 py-1 rounded-full transition-colors flex items-center justify-center"
                  title="Remove option"
                  style={{ lineHeight: 1 }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addOption}
          className="w-full bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold py-2 rounded-lg shadow hover:from-purple-500 hover:to-blue-500 transition-colors mb-2 text-sm sm:text-base"
        >
          + Add Option
        </button>
        <input
          className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm sm:text-base mb-2"
          type="number"
          min="10"
          max="300"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          placeholder="Duration (seconds)"
          required
        />
        <button
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 rounded-lg shadow hover:from-purple-600 hover:to-blue-600 transition-colors text-sm sm:text-lg mt-2"
          type="submit"
        >
          Create Poll
        </button>
      </form>
    </div>
  );
}
