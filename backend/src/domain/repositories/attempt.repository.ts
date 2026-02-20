import { QuizAttemptEntity } from '../entities/quiz-attempt.entity';

export interface CreateAttemptData {
  userId: string;
  quizId: string;
}

export interface CreateAttemptAnswerData {
  attemptId: string;
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  xpChange: number;
}

export interface IAttemptRepository {
  create(data: CreateAttemptData): Promise<QuizAttemptEntity>;
  findById(id: string): Promise<QuizAttemptEntity | null>;
  findByUser(userId: string): Promise<QuizAttemptEntity[]>;
  update(id: string, data: Partial<{ xpEarned: number; totalRight: number; totalWrong: number; completedAt: Date }>): Promise<QuizAttemptEntity>;
  addAnswer(data: CreateAttemptAnswerData): Promise<void>;
}

export const ATTEMPT_REPOSITORY = Symbol('IAttemptRepository');
