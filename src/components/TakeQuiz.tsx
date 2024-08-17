import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Box,
} from "@mui/material";
import { useQuizContext } from "../context/QuizContext";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { quizlist } from "../jsonObject";

const TakeQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { quizzes, addResult } = useQuizContext();
  const quiz = [...quizlist, ...quizzes].find((q) => q.id === id);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [candidateName, setCandidateName] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);

  if (!quiz) {
    return <Typography>Quiz not found</Typography>;
  }

  const handleAnswer = (answer: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handlePrevious = () => {
    setCurrentQuestion(Math.max(0, currentQuestion - 1));
  };

  const handleNext = () => {
    setCurrentQuestion(
      Math.min(quiz.questions.length - 1, currentQuestion + 1)
    );
  };

  const handleFinish = () => {
    const score = answers.reduce((total: number, answer, index) => {
      if (answer === null) return total;
      return total + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);

    const result = {
      id: Date.now().toString(),
      userId: currentUser?.id || "anonymous",
      quizId: quiz.id,
      candidateName,
      score,
      totalQuestions: quiz.questions.length,
      date: new Date().toISOString(),
    };
    addResult(result);
    toast.success("Quiz completed successfully!");
    navigate("/results", { state: { latestResult: result } });
  };

  const startQuiz = () => {
    if (candidateName.trim()) {
      setQuizStarted(true);
      setAnswers(new Array(quiz.questions.length).fill(null));
    }
  };

  if (!quizStarted) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Start Quiz: {quiz.title}
        </Typography>
        <TextField
          fullWidth
          label="Your Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          onClick={startQuiz}
          disabled={!candidateName.trim()}
        >
          Start Quiz
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        {quiz.title}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Question {currentQuestion + 1} of {quiz.questions.length}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {quiz.questions[currentQuestion].text}
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          value={answers[currentQuestion] ?? ""}
          onChange={(e) => handleAnswer(parseInt(e.target.value))}
        >
          {quiz.questions[currentQuestion].options.map((option, index) => (
            <FormControlLabel
              key={index}
              value={index}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        {currentQuestion < quiz.questions.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleFinish}
            disabled={answers === null}
          >
            Finish
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default TakeQuiz;
