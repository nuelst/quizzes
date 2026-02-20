import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GetUserUseCase } from '../../../application/use-cases/user/get-user.use-case';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  @Get(':id')
  @ApiOperation({ summary: 'Busca perfil de usuário por ID' })
  async findOne(@Param('id') id: string) {
    const user = await this.getUserUseCase.execute(id);
    return { id: user.id, username: user.username, name: user.name, xpPoints: user.xpPoints };
  }
}
