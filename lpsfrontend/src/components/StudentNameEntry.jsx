import React, { useState } from "react";

export default function StudentNameEntry({ onSave }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      sessionStorage.setItem("studentName", name.trim());
      onSave(name.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center mt-10">
      <label className="mb-2 text-lg">Enter your name:</label>
      <input
        className="border px-3 py-2 rounded mb-2 w-64"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" type="submit">Save</button>
    </form>
  );
} 