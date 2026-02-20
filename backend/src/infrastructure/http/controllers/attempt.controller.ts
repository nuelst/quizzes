import { Controller, Post, Body, Param, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { StartAttemptUseCase } from '../../../application/use-cases/attempt/start-attempt.use-case';
import { SubmitAnswerUseCase } from '../../../application/use-cases/attempt/submit-answer.use-case';
import { CompleteAttemptUseCase } from '../../../application/use-cases/attempt/complete-attempt.use-case';
import { StartAttemptDto, SubmitAnswerDto } from '../../../application/dtos';
import { Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository';

export interface SubmitAnswerOutput {
  isCorrect: boolean;
  xpChange: number;
  newXpTotal: number;
  correctAnswerId: string;
}

@ApiTags('attempts')
@Controller('attempts')
export class AttemptController {
  constructor(
    private readonly startAttempt: StartAttemptUseCase,
    private readonly submitAnswer: SubmitAnswerUseCase,
    private readonly completeAttempt: CompleteAttemptUseCase,
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  private async resolveUser(userId?: string): Promise<string> {
    if (!userId) throw new UnauthorizedException('Faça login antes de jogar. Envie o header x-user-id.');
    const user = await this.userRepo.findById(userId);
    if (!user) throw new UnauthorizedException('Usuário não encontrado. Faça login primeiro.');
    return user.id;
  }

  @Post()
  @ApiOperation({ summary: 'Inicia uma tentativa de quiz' })
  @ApiHeader({ name: 'x-user-id', description: 'ID do usuário logado', required: true })
  async start(@Body() dto: StartAttemptDto, @Headers('x-user-id') userId: string) {
    const resolvedUserId = await this.resolveUser(userId);
    const attempt = await this.startAttempt.execute({ userId: resolvedUserId, quizId: dto.quizId });
    return { id: attempt.id, userId: attempt.userId, quizId: attempt.quizId, xpEarned: attempt.xpEarned, createdAt: attempt.createdAt };
  }

  @Post(':id/answers')
  @ApiOperation({ summary: 'Envia uma resposta (+50 XP acerto / -15 XP erro)' })
  @ApiHeader({ name: 'x-user-id', description: 'ID do usuário logado', required: true })
  async answer(
    @Param('id') attemptId: string,
    @Body() dto: SubmitAnswerDto,
    @Headers('x-user-id') userId: string,
  ): Promise<SubmitAnswerOutput> {
    await this.resolveUser(userId);
    return this.submitAnswer.execute({ attemptId, questionId: dto.questionId, answerId: dto.answerId });
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Finaliza a tentativa do quiz' })
  @ApiHeader({ name: 'x-user-id', description: 'ID do usuário logado', required: true })
  async complete(@Param('id') attemptId: string, @Headers('x-user-id') userId: string) {
    await this.resolveUser(userId);
    const attempt = await this.completeAttempt.execute(attemptId);
    return { id: attempt.id, xpEarned: attempt.xpEarned, totalRight: attempt.totalRight, totalWrong: attempt.totalWrong, accuracy: attempt.accuracy, completedAt: attempt.completedAt };
  }
}
