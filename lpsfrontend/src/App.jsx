import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelector from "./pages/RoleSelector";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import PollHistory from "./pages/PollHistory";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<RoleSelector />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/history" element={<PollHistory />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
