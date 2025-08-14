import React, { useState } from "react";

export default function PollForm() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState(60);

  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (idx) => setOptions(options.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Integrate with backend (socket emit)
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Create New Poll</h3>
      <input
        className="border px-3 py-2 rounded mb-2 w-full"
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />
      {options.map((opt, idx) => (
        <div key={idx} className="flex mb-2">
          <input
            className="border px-3 py-2 rounded flex-1"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            required
          />
          {options.length > 2 && (
            <button type="button" onClick={() => removeOption(idx)} className="ml-2 text-red-500">Remove</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addOption} className="bg-gray-200 px-3 py-1 rounded mb-2">Add Option</button>
      <input
        className="border px-3 py-2 rounded mb-2 w-full"
        type="number"
        min="10"
        max="300"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        placeholder="Duration (seconds)"
        required
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" type="submit">Create Poll</button>
    </form>
  );
} 