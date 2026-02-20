import { QuizAttemptEntity } from '@domain/entities/quiz-attempt.entity';
import { ATTEMPT_REPOSITORY, IAttemptRepository } from '@domain/repositories/attempt.repository';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CompleteAttemptUseCase {
  constructor(
    @Inject(ATTEMPT_REPOSITORY)
    private readonly attemptRepository: IAttemptRepository,
  ) { }

  async execute(attemptId: string): Promise<QuizAttemptEntity> {
    const attempt = await this.attemptRepository.findById(attemptId);
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.isCompleted) throw new BadRequestException('Attempt already completed');

    attempt.complete();

    return this.attemptRepository.update(attemptId, {
      completedAt: attempt.completedAt,
    });
  }
}
