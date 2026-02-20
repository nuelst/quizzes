import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  findRanking(limit?: number): Promise<UserEntity[]>;
  create(data: { username: string; name: string; xpPoints?: number }): Promise<UserEntity>;
  update(id: string, data: Partial<{ name: string; xpPoints: number }>): Promise<UserEntity>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
