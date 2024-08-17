export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface User {
  id: string;
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface QuizResult {
  quizId: string;
  candidateName: string;
  score: number;
  totalQuestions: number;
  date: string;
}
