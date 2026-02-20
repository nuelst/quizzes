import { UserEntity } from '@domain/entities/user.entity';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories/user.repository';
import { ConflictException, Inject, Injectable } from '@nestjs/common';

interface LoginOrRegisterInput {
  username: string;
  name?: string; // required only on first access (register)
}

interface LoginOrRegisterOutput {
  user: UserEntity;
  isNew: boolean;
}

@Injectable()
export class LoginOrRegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(input: LoginOrRegisterInput): Promise<LoginOrRegisterOutput> {
    const existing = await this.userRepository.findByUsername(input.username);

    if (existing) {
      // Username encontrado — login
      return { user: existing, isNew: false };
    }

    // Username não encontrado — precisa do name para registrar
    if (!input.name || input.name.trim() === '') {
      throw new ConflictException({
        message: 'Usuário não encontrado. Informe seu nome para criar o perfil.',
        requiresName: true,
      });
    }

    // Registra novo usuário
    const user = await this.userRepository.create({
      username: input.username.trim().toLowerCase(),
      name: input.name.trim(),
    });

    return { user, isNew: true };
  }
}
