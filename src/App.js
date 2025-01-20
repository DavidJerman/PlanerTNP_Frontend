import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Calendar from "./components/calendar/calendar";
import Navbar from "./components/navbar";
import Login from "./components/profile/login";
import Profile from "./components/profile/profile";
import Register from "./components/profile/register";
import TodoList from "./components/todos/TodoList";
import Pie from "./components/pie/pie";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for theme preference
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    // Update the theme class on the body element
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <BrowserRouter>
      <Navbar toggleTheme={toggleTheme} darkMode={darkMode} />
      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todos" element={<TodoList />} />
        <Route path="/pie" element={<Pie />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
