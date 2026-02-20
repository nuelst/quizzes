import { QuizAttemptEntity } from '@domain/entities/quiz-attempt.entity';
import { ATTEMPT_REPOSITORY, IAttemptRepository } from '@domain/repositories/attempt.repository';
import { IQuizRepository, QUIZ_REPOSITORY } from '@domain/repositories/quiz.repository';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories/user.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

interface StartAttemptInput {
  userId: string;
  quizId: string;
}

@Injectable()
export class StartAttemptUseCase {
  constructor(
    @Inject(ATTEMPT_REPOSITORY) private readonly attemptRepository: IAttemptRepository,
    @Inject(QUIZ_REPOSITORY) private readonly quizRepository: IQuizRepository,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) { }

  async execute(input: StartAttemptInput): Promise<QuizAttemptEntity> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const quiz = await this.quizRepository.findById(input.quizId);
    if (!quiz) throw new NotFoundException('Quiz não encontrado');

    return this.attemptRepository.create({ userId: input.userId, quizId: input.quizId });
  }
}
