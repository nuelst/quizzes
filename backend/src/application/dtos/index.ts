import { IsString, IsNotEmpty, IsUUID, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginOrRegisterDto {
  @ApiProperty({ example: 'geo_master', description: 'Username único (sem espaços, minúsculo)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-z0-9_]+$/, { message: 'username só pode conter letras minúsculas, números e _' })
  username: string;

  @ApiPropertyOptional({ example: 'João Silva', description: 'Nome completo (obrigatório apenas no primeiro acesso)' })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  name?: string;
}

export class StartAttemptDto {
  @ApiProperty({ example: 'uuid-do-quiz' })
  @IsUUID()
  @IsNotEmpty()
  quizId: string;
}

export class SubmitAnswerDto {
  @ApiProperty({ example: 'uuid-da-questao' })
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({ example: 'uuid-da-resposta' })
  @IsUUID()
  @IsNotEmpty()
  answerId: string;
}
