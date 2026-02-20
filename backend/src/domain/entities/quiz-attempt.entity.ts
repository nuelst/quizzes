export class QuizAttemptEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly quizId: string,
    public xpEarned: number,
    public totalRight: number,
    public totalWrong: number,
    public completedAt: Date | null,
    public readonly createdAt: Date,
  ) {}

  complete(): void {
    this.completedAt = new Date();
  }

  get isCompleted(): boolean {
    return this.completedAt !== null;
  }

  get accuracy(): number {
    const total = this.totalRight + this.totalWrong;
    if (total === 0) return 0;
    return Math.round((this.totalRight / total) * 100);
  }
}
