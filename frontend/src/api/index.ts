import axios from 'axios';
import { AnswerResult, Attempt, AttemptResult, Quiz, QuizDetail, RankingEntry, SessionResult, User } from '../types';
import { env } from '../env';

const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('quiz_user_id');
  if (userId) config.headers['x-user-id'] = userId;
  return config;
});

export const authApi = {
  session: (username: string, name?: string): Promise<SessionResult> =>
    api.post('/auth/session', { username, name }).then((r) => r.data),

  ranking: (limit = 10): Promise<RankingEntry[]> =>
    api.get(`/auth/ranking?limit=${limit}`).then((r) => r.data),
};

export const quizApi = {
  getAll: (): Promise<Quiz[]> =>
    api.get('/quizzes').then((r) => r.data),

  getById: (id: string): Promise<QuizDetail> =>
    api.get(`/quizzes/${id}`).then((r) => r.data),
};

export const userApi = {
  getById: (id: string): Promise<User> =>
    api.get(`/users/${id}`).then((r) => r.data),
};

export const attemptApi = {
  start: (quizId: string): Promise<Attempt> =>
    api.post('/attempts', { quizId }).then((r) => r.data),

  submitAnswer: (attemptId: string, questionId: string, answerId: string): Promise<AnswerResult> =>
    api.post(`/attempts/${attemptId}/answers`, { questionId, answerId }).then((r) => r.data),

  complete: (attemptId: string): Promise<AttemptResult> =>
    api.post(`/attempts/${attemptId}/complete`).then((r) => r.data),
};
