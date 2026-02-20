import { ATTEMPT_REPOSITORY, IAttemptRepository } from '@domain/repositories/attempt.repository';
import { IQuizRepository, QUIZ_REPOSITORY } from '@domain/repositories/quiz.repository';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories/user.repository';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

interface SubmitAnswerInput {
  attemptId: string;
  questionId: string;
  answerId: string;
}

interface SubmitAnswerOutput {
  isCorrect: boolean;
  xpChange: number;
  newXpTotal: number;
  correctAnswerId: string;
}

@Injectable()
export class SubmitAnswerUseCase {
  constructor(
    @Inject(ATTEMPT_REPOSITORY)
    private readonly attemptRepository: IAttemptRepository,
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(input: SubmitAnswerInput): Promise<SubmitAnswerOutput> {
    const attempt = await this.attemptRepository.findById(input.attemptId);
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.isCompleted) throw new BadRequestException('This attempt is already completed');

    const quiz = await this.quizRepository.findById(attempt.quizId);
    if (!quiz) throw new NotFoundException('Quiz not found');

    const question = quiz.questions.find((q) => q.id === input.questionId);
    if (!question) throw new NotFoundException('Question not found in this quiz');

    const correctAnswer = question.getCorrectAnswer();
    const isCorrect = question.isAnswerCorrect(input.answerId);

    const user = await this.userRepository.findById(attempt.userId);
    if (!user) throw new NotFoundException('User not found');

    // Apply XP change to user (can go negative)
    const xpChange = user.applyXpChange(isCorrect);

    // Update user XP in database
    await this.userRepository.update(user.id, { xpPoints: user.xpPoints });

    // Record the answer
    await this.attemptRepository.addAnswer({
      attemptId: input.attemptId,
      questionId: input.questionId,
      answerId: input.answerId,
      isCorrect,
      xpChange,
    });

    // Update attempt stats
    await this.attemptRepository.update(input.attemptId, {
      xpEarned: attempt.xpEarned + xpChange,
      totalRight: isCorrect ? attempt.totalRight + 1 : attempt.totalRight,
      totalWrong: !isCorrect ? attempt.totalWrong + 1 : attempt.totalWrong,
    });

    return {
      isCorrect,
      xpChange,
      newXpTotal: user.xpPoints,
      correctAnswerId: correctAnswer?.id ?? '',
    };
  }
}
