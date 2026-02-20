import { QuestionEntity } from './question.entity';

export class QuizEntity {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public category: string,
    public readonly createdAt: Date,
    public questions: QuestionEntity[] = [],
  ) {}

  get totalQuestions(): number {
    return this.questions.length;
  }
}
