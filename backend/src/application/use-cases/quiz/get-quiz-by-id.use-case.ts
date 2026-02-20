import { QuizEntity } from '@domain/entities/quiz.entity';
import { IQuizRepository, QUIZ_REPOSITORY } from '@domain/repositories/quiz.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetQuizByIdUseCase {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
  ) { }

  async execute(id: string): Promise<QuizEntity> {
    const quiz = await this.quizRepository.findById(id);
    if (!quiz) {
      throw new NotFoundException(`Quiz with id "${id}" not found`);
    }
    return quiz;
  }
}
