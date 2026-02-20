import { AnswerEntity } from './answer.entity';

export class QuestionEntity {
  constructor(
    public readonly id: string,
    public readonly quizId: string,
    public text: string,
    public readonly createdAt: Date,
    public answers: AnswerEntity[] = [],
  ) {}

  getCorrectAnswer(): AnswerEntity | undefined {
    return this.answers.find((a) => a.isCorrect);
  }

  isAnswerCorrect(answerId: string): boolean {
    const answer = this.answers.find((a) => a.id === answerId);
    return answer?.isCorrect ?? false;
  }
}
