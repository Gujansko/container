import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import LoginForm from "./components/LoginForm/LoginForm";
import Navbar from "./components/Navbar/Navbar";
import UserDataContextProvider from "./contexts/UserDataContextProvider";

const App = () => {
  return (
    <Router>
      <UserDataContextProvider>
        <Navbar />
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </UserDataContextProvider>
    </Router>
  );
};

export default App;
