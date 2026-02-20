export class UserEntity {
  constructor(
    public readonly id: string,
    public username: string,
    public name: string,
    public xpPoints: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static readonly XP_GAIN = 50;
  static readonly XP_LOSS = 15;

  addXp(): void {
    this.xpPoints += UserEntity.XP_GAIN;
  }

  subtractXp(): void {
    this.xpPoints -= UserEntity.XP_LOSS;
    // pode ficar negativo — requisito intencional
  }

  applyXpChange(isCorrect: boolean): number {
    if (isCorrect) {
      this.addXp();
      return UserEntity.XP_GAIN;
    } else {
      this.subtractXp();
      return -UserEntity.XP_LOSS;
    }
  }
}
