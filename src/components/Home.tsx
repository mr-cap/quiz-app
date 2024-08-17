import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useQuizContext } from "../context/QuizContext";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { quizlist } from "../jsonObject";

const Home: React.FC = () => {
  const { quizzes, deleteQuiz } = useQuizContext();
  const { currentUser } = useAuth();
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [quizToDelete, setQuizToDelete] = React.useState<string | null>(null);

  const handleDeleteClick = (quizId: string) => {
    setQuizToDelete(quizId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (quizToDelete) {
      deleteQuiz(quizToDelete);
      toast.success("Quiz deleted successfully!");
    }
    setOpenDeleteDialog(false);
    setQuizToDelete(null);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setQuizToDelete(null);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Available Quizzes
      </Typography>
      <Grid container spacing={3}>
        {[...quizlist, ...quizzes].map((quiz) => (
          <Grid item xs={12} sm={6} md={4} key={quiz.id}>
            <Card sx={{ textAlign: "center !important" }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {quiz.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {quiz.questions.length} MCQ's
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: "center !important",
                  paddingBottom: "2rem",
                }}
              >
                {currentUser?.isAdmin ? (
                  <>
                    <Button
                      component={Link}
                      to={`/edit-quiz/${quiz.id}`}
                      size="small"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(quiz.id)}
                      size="small"
                      color="error"
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <Button
                    component={Link}
                    to={`/take-quiz/${quiz.id}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: "8rem",
                    }}
                  >
                    Take Test
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Quiz"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this quiz? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home;
