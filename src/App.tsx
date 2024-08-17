import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QuizProvider } from "./context/QuizContext";
import Header from "./components/Header";
import Home from "./components/Home";
import TakeQuiz from "./components/TakeQuiz";
import CreateQuiz from "./components/CreateQuiz";
import Results from "./components/Results";
import EditQuiz from "./components/EditQuiz";
import Login from "./components/Login";
import { AuthProvider } from "./context/AuthContext";

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <QuizProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/take-quiz/:id" element={<TakeQuiz />} />
              <Route path="/edit-quiz/:id" element={<EditQuiz />} />
              <Route path="/create-quiz" element={<CreateQuiz />} />
              <Route path="/results" element={<Results />} />
            </Routes>
          </Router>
          <ToastContainer position="bottom-right" />
        </QuizProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
