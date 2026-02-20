import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginOrRegisterUseCase } from '../../../application/use-cases/auth/login-or-register.use-case';
import { GetRankingUseCase } from '../../../application/use-cases/auth/get-ranking.use-case';
import { LoginOrRegisterDto } from '../../../application/dtos';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginOrRegister: LoginOrRegisterUseCase,
    private readonly getRanking: GetRankingUseCase,
  ) {}

  @Post('session')
  @ApiOperation({
    summary: 'Login ou cadastro por username',
    description: `
      - Se o username já existir → retorna o perfil (login)
      - Se o username não existir e "name" foi enviado → cria perfil (registro)
      - Se o username não existir e "name" não foi enviado → retorna erro 409 com requiresName: true
    `,
  })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido' })
  @ApiResponse({ status: 201, description: 'Perfil criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Username não encontrado, nome necessário para criar perfil' })
  async session(@Body() dto: LoginOrRegisterDto) {
    const result = await this.loginOrRegister.execute({
      username: dto.username,
      name: dto.name,
    });

    return {
      isNew: result.isNew,
      user: {
        id: result.user.id,
        username: result.user.username,
        name: result.user.name,
        xpPoints: result.user.xpPoints,
      },
    };
  }

  @Get('ranking')
  @ApiOperation({ summary: 'Ranking dos jogadores por XP (top 10)' })
  async ranking(@Query('limit') limit?: string) {
    const users = await this.getRanking.execute(limit ? parseInt(limit) : 10);
    return users.map((u, index) => ({
      position: index + 1,
      id: u.id,
      username: u.username,
      name: u.name,
      xpPoints: u.xpPoints,
    }));
  }
}
