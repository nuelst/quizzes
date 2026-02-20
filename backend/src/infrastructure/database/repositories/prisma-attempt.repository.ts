import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAttemptRepository, CreateAttemptData, CreateAttemptAnswerData } from '../../../domain/repositories/attempt.repository';
import { QuizAttemptEntity } from '../../../domain/entities/quiz-attempt.entity';

@Injectable()
export class PrismaAttemptRepository implements IAttemptRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(a: any): QuizAttemptEntity {
    return new QuizAttemptEntity(
      a.id, a.userId, a.quizId, a.xpEarned, a.totalRight, a.totalWrong, a.completedAt, a.createdAt,
    );
  }

  async create(data: CreateAttemptData): Promise<QuizAttemptEntity> {
    const attempt = await this.prisma.quizAttempt.create({ data });
    return this.mapToEntity(attempt);
  }

  async findById(id: string): Promise<QuizAttemptEntity | null> {
    const attempt = await this.prisma.quizAttempt.findUnique({ where: { id } });
    if (!attempt) return null;
    return this.mapToEntity(attempt);
  }

  async findByUser(userId: string): Promise<QuizAttemptEntity[]> {
    const attempts = await this.prisma.quizAttempt.findMany({ where: { userId } });
    return attempts.map((a) => this.mapToEntity(a));
  }

  async update(id: string, data: any): Promise<QuizAttemptEntity> {
    const attempt = await this.prisma.quizAttempt.update({ where: { id }, data });
    return this.mapToEntity(attempt);
  }

  async addAnswer(data: CreateAttemptAnswerData): Promise<void> {
    await this.prisma.attemptAnswer.create({ data });
  }
}
