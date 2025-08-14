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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center mt-10 px-4 sm:px-0 w-full"
    >
      <label className="mb-2 text-base sm:text-lg font-medium text-center w-full max-w-sm">
        Enter your name:
      </label>
      <input
        className="border px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Your Name"
      />
      <button
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded w-full max-w-sm font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition text-base sm:text-lg"
        type="submit"
      >
        Save
      </button>
    </form>
  );
}
