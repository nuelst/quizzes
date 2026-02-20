export class AnswerEntity {
  constructor(
    public readonly id: string,
    public readonly questionId: string,
    public text: string,
    public isCorrect: boolean,
  ) {}
}
