export interface User {
  id: string;
  username: string;
  name: string;
  xpPoints: number;
}

export interface RankingEntry {
  position: number;
  id: string;
  username: string;
  name: string;
  xpPoints: number;
}

export interface Answer {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  totalQuestions: number;
  createdAt: string;
}

export interface QuizDetail extends Quiz {
  questions: Question[];
}

export interface Attempt {
  id: string;
  userId: string;
  quizId: string;
  xpEarned: number;
  createdAt: string;
}

export interface AnswerResult {
  isCorrect: boolean;
  xpChange: number;
  newXpTotal: number;
  correctAnswerId: string;
}

export interface AttemptResult {
  id: string;
  xpEarned: number;
  totalRight: number;
  totalWrong: number;
  accuracy: number;
  completedAt: string;
}

export interface SessionResult {
  isNew: boolean;
  user: User;
}
