import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuizContext } from "../context/QuizContext";
import { Quiz, Question } from "../types";
import { toast } from "react-toastify";

const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { addQuiz } = useQuizContext();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        text: "",
        options: ["", ""],
        correctAnswer: 0,
      },
    ]);
  };

  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | number | string[]
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      title,
      questions,
    };
    addQuiz(newQuiz);
    toast.success("Quiz created successfully!");
    navigate("/");
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Create Quiz
      </Typography>
      <TextField
        fullWidth
        label="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
      />
      {questions.map((question, questionIndex) => (
        <Box
          key={question.id}
          sx={{ mb: 4, p: 2, border: "1px solid #ccc", borderRadius: 2 }}
        >
          <Typography variant="h6">Question {questionIndex + 1}</Typography>
          <TextField
            fullWidth
            label="Question Text"
            value={question.text}
            onChange={(e) =>
              updateQuestion(questionIndex, "text", e.target.value)
            }
            margin="normal"
          />
          {question.options.map((option, optionIndex) => (
            <Box
              key={optionIndex}
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <TextField
                fullWidth
                label={`Option ${optionIndex + 1}`}
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...question.options];
                  updatedOptions[optionIndex] = e.target.value;
                  updateQuestion(questionIndex, "options", updatedOptions);
                }}
                margin="dense"
              />
              <IconButton
                onClick={() => removeOption(questionIndex, optionIndex)}
                disabled={question.options.length <= 2}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Box sx={{ mt: 1, mb: 2 }}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => addOption(questionIndex)}
            >
              Add Option
            </Button>
          </Box>
          <TextField
            fullWidth
            label="Correct Answer (0-based index)"
            type="number"
            value={question.correctAnswer}
            onChange={(e) =>
              updateQuestion(
                questionIndex,
                "correctAnswer",
                parseInt(e.target.value)
              )
            }
            margin="normal"
            InputProps={{
              inputProps: { min: 0, max: question.options.length - 1 },
            }}
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => removeQuestion(questionIndex)}
            >
              Remove Question
            </Button>
          </Box>
        </Box>
      ))}
      <Box sx={{ mt: 2, mb: 4 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={addQuestion}
          variant="outlined"
        >
          Add Question
        </Button>
      </Box>
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!title || questions.length === 0}
      >
        Create Quiz
      </Button>
    </Container>
  );
};

export default CreateQuiz;
