import React from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import { useQuizContext } from "../context/QuizContext";
import { useLocation } from "react-router-dom";
import { QuizResult } from "../types";
import { quizlist } from "../jsonObject";

const ResultItem: React.FC<{ result: QuizResult; quizTitle: string }> = ({
  result,
  quizTitle,
}) => (
  <Paper elevation={2} sx={{ mb: 2, p: 2 }}>
    <Typography variant="h6" gutterBottom>
      Quiz: {quizTitle}
    </Typography>
    <Typography variant="body1" gutterBottom>
      Candidate: {result.candidateName}
    </Typography>
    <Typography variant="body1" gutterBottom>
      Score: {result.score}/{result.totalQuestions}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Date: {new Date(result.date).toLocaleString()}
    </Typography>
  </Paper>
);

const Results: React.FC = () => {
  const { results, quizzes } = useQuizContext();
  const location = useLocation();
  const latestResult = location.state?.latestResult;
  const sortedResults = [...results].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Quiz Results
      </Typography>
      {latestResult && (
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Latest Result
          </Typography>
          <ResultItem
            result={latestResult}
            quizTitle={
              [...quizlist, ...quizzes].find(
                (q) => q.id === latestResult.quizId
              )?.title || "Unkown  Quize"
            }
          />
        </Box>
      )}
      <Divider sx={{ mb: 4 }} />
      <Typography variant="h4" gutterBottom>
        Past Results
      </Typography>
      <List>
        {sortedResults.map((result, index) => {
          const quiz = [...quizlist, ...quizzes].find(
            (q) => q.id === result.quizId
          );
          return (
            <ListItem
              key={index}
              disablePadding
              sx={{ width: "100% !important" }}
            >
              <ResultItem
                result={result}
                quizTitle={quiz?.title || "Unknown Quiz"}
              />
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
};

export default Results;
