import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './infrastructure/database/prisma/prisma.service';
import { PrismaUserRepository } from './infrastructure/database/repositories/prisma-user.repository';
import { PrismaQuizRepository } from './infrastructure/database/repositories/prisma-quiz.repository';
import { PrismaAttemptRepository } from './infrastructure/database/repositories/prisma-attempt.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { QUIZ_REPOSITORY } from './domain/repositories/quiz.repository';
import { ATTEMPT_REPOSITORY } from './domain/repositories/attempt.repository';

import { GetAllQuizzesUseCase } from './application/use-cases/quiz/get-all-quizzes.use-case';
import { GetQuizByIdUseCase } from './application/use-cases/quiz/get-quiz-by-id.use-case';
import { GetUserUseCase } from './application/use-cases/user/get-user.use-case';
import { StartAttemptUseCase } from './application/use-cases/attempt/start-attempt.use-case';
import { SubmitAnswerUseCase } from './application/use-cases/attempt/submit-answer.use-case';
import { CompleteAttemptUseCase } from './application/use-cases/attempt/complete-attempt.use-case';
import { LoginOrRegisterUseCase } from './application/use-cases/auth/login-or-register.use-case';
import { GetRankingUseCase } from './application/use-cases/auth/get-ranking.use-case';

import { QuizController } from './infrastructure/http/controllers/quiz.controller';
import { UserController } from './infrastructure/http/controllers/user.controller';
import { AttemptController } from './infrastructure/http/controllers/attempt.controller';
import { AuthController } from './infrastructure/http/controllers/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
    }),
  ],
  controllers: [AuthController, QuizController, UserController, AttemptController],
  providers: [
    PrismaService,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: QUIZ_REPOSITORY, useClass: PrismaQuizRepository },
    { provide: ATTEMPT_REPOSITORY, useClass: PrismaAttemptRepository },
    LoginOrRegisterUseCase,
    GetRankingUseCase,
    GetAllQuizzesUseCase,
    GetQuizByIdUseCase,
    GetUserUseCase,
    StartAttemptUseCase,
    SubmitAnswerUseCase,
    CompleteAttemptUseCase,
  ],
})
export class AppModule { }
