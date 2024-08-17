import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { quizlist } from "../jsonObject";

const EditQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { quizzes, updateQuiz } = useQuizContext();
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const foundQuiz = [...quizlist, ...quizzes].find((q) => q.id === id);
    if (foundQuiz) {
      setQuiz(foundQuiz);
    } else {
      navigate("/");
    }
  }, [id, quizzes, navigate]);

  if (!quiz) {
    return <Typography>Loading...</Typography>;
  }

  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | number | string[]
  ) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          id: Date.now().toString(),
          text: "",
          options: ["", ""],
          correctAnswer: 0,
        },
      ],
    });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options.push("");
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSubmit = () => {
    if (quiz) {
      const existingQuizIndex = quizlist.findIndex((q) => q.id === quiz.id);

      if (existingQuizIndex !== -1) {
        // Update existing quiz in jsonObject
        quizlist[existingQuizIndex] = quiz;
      } else {
        toast.error("Quiz not found in the list!");
        return;
      }
      updateQuiz(quiz);
      toast.success("Quiz updated successfully!");
      navigate("/");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Quiz
      </Typography>
      <TextField
        fullWidth
        label="Quiz Title"
        value={quiz.title}
        onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
        margin="normal"
      />
      {quiz.questions.map((question, questionIndex) => (
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
        disabled={quiz.title.trim() === "" || quiz.questions.length === 0}
      >
        Update Quiz
      </Button>
    </Container>
  );
};

export default EditQuiz;
