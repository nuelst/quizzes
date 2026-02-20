import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) { }

  private map(u: any): UserEntity {
    return new UserEntity(u.id, u.username, u.name, u.xpPoints, u.createdAt, u.updatedAt);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const u = await this.prisma.user.findUnique({ where: { id } });
    return u ? this.map(u) : null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const u = await this.prisma.user.findUnique({ where: { username } });
    return u ? this.map(u) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => this.map(u));
  }

  async findRanking(limit = 10): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { xpPoints: 'desc' },
      take: limit,
    });
    return users.map((u) => this.map(u));
  }

  async create(data: { username: string; name: string; xpPoints?: number }): Promise<UserEntity> {
    const u = await this.prisma.user.create({
      data: { username: data.username, name: data.name, xpPoints: data.xpPoints ?? 0 },
    });
    return this.map(u);
  }

  async update(id: string, data: Partial<{ name: string; xpPoints: number }>): Promise<UserEntity> {
    const u = await this.prisma.user.update({ where: { id }, data });
    return this.map(u);
  }
}
