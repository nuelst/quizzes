import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IQuizRepository } from '../../../domain/repositories/quiz.repository';
import { QuizEntity } from '../../../domain/entities/quiz.entity';
import { QuestionEntity } from '../../../domain/entities/question.entity';
import { AnswerEntity } from '../../../domain/entities/answer.entity';

@Injectable()
export class PrismaQuizRepository implements IQuizRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(quiz: any): QuizEntity {
    const questions = (quiz.questions ?? []).map((q: any) => {
      const answers = (q.answers ?? []).map(
        (a: any) => new AnswerEntity(a.id, a.questionId, a.text, a.isCorrect),
      );
      return new QuestionEntity(q.id, q.quizId, q.text, q.createdAt, answers);
    });
    return new QuizEntity(quiz.id, quiz.title, quiz.description, quiz.category, quiz.createdAt, questions);
  }

  async findAll(): Promise<QuizEntity[]> {
    const quizzes = await this.prisma.quiz.findMany({
      include: {
        questions: {
          include: { answers: true },
        },
      },
    });
    return quizzes.map((q) => this.mapToEntity(q));
  }

  async findById(id: string): Promise<QuizEntity | null> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: { answers: true },
        },
      },
    });
    if (!quiz) return null;
    return this.mapToEntity(quiz);
  }

  async findByCategory(category: string): Promise<QuizEntity[]> {
    const quizzes = await this.prisma.quiz.findMany({
      where: { category },
      include: {
        questions: {
          include: { answers: true },
        },
      },
    });
    return quizzes.map((q) => this.mapToEntity(q));
  }
}
