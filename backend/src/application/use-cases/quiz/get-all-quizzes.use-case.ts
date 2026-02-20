import { QuizEntity } from '@domain/entities/quiz.entity';
import { IQuizRepository, QUIZ_REPOSITORY } from '@domain/repositories/quiz.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetAllQuizzesUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) { }

  async execute(): Promise<QuizEntity[]> {
    return this.quizRepository.findAll();
  }
}
