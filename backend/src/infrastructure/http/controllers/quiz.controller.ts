import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GetAllQuizzesUseCase } from '../../../application/use-cases/quiz/get-all-quizzes.use-case';
import { GetQuizByIdUseCase } from '../../../application/use-cases/quiz/get-quiz-by-id.use-case';

@ApiTags('quizzes')
@Controller('quizzes')
export class QuizController {
  constructor(
    private readonly getAllQuizzes: GetAllQuizzesUseCase,
    private readonly getQuizById: GetQuizByIdUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all quizzes' })
  async findAll() {
    const quizzes = await this.getAllQuizzes.execute();
    return quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      category: q.category,
      totalQuestions: q.totalQuestions,
      createdAt: q.createdAt,
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a quiz with its questions (answers shuffled, correct not exposed)' })
  async findOne(@Param('id') id: string) {
    const quiz = await this.getQuizById.execute(id);
    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      totalQuestions: quiz.totalQuestions,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        text: q.text,
        answers: q.answers.map((a) => ({
          id: a.id,
          text: a.text,
          // isCorrect is intentionally NOT returned here
        })),
      })),
    };
  }
}
