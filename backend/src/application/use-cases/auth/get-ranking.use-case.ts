import { UserEntity } from '@domain/entities/user.entity';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetRankingUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(limit = 10): Promise<UserEntity[]> {
    return this.userRepository.findRanking(limit);
  }
}
