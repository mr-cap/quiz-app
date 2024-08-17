import React, { createContext, useState, useEffect, useContext } from 'react';
import { Quiz, QuizResult } from '../types';

interface QuizContextType {
  quizzes: Quiz[];
  results: QuizResult[];
  addQuiz: (quiz: Quiz) => void;
  updateQuiz: (quiz: Quiz) => void;
  deleteQuiz: (quizId: string) => void;
  addResult: (result: QuizResult) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    const storedQuizzes = localStorage.getItem('quizzes');
    const storedResults = localStorage.getItem('results');
    if (storedQuizzes) setQuizzes(JSON.parse(storedQuizzes));
    if (storedResults) setResults(JSON.parse(storedResults));
  }, []);

  useEffect(() => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    localStorage.setItem('results', JSON.stringify(results));
  }, [quizzes, results]);

  const addQuiz = (quiz: Quiz) => {
    setQuizzes([...quizzes, quiz]);
  };

  const updateQuiz = (updatedQuiz: Quiz) => {
    setQuizzes(quizzes.map(quiz => quiz.id === updatedQuiz.id ? updatedQuiz : quiz));
  };

  const deleteQuiz = (quizId: string) => {
    setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
  };

  const addResult = (result: QuizResult) => {
    setResults([...results, result]);
  };

  return (
    <QuizContext.Provider value={{ quizzes, results, addQuiz, updateQuiz, deleteQuiz, addResult }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};