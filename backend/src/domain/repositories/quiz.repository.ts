import { QuizEntity } from '../entities/quiz.entity';

export interface IQuizRepository {
  findAll(): Promise<QuizEntity[]>;
  findById(id: string): Promise<QuizEntity | null>;
  findByCategory(category: string): Promise<QuizEntity[]>;
}

export const QUIZ_REPOSITORY = Symbol('IQuizRepository');
