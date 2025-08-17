import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches } from 'class-validator';
import { CNPJ_REGEX, CPF_REGEX } from '@shared/constants';

export class CreatePersonDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: '12345678901' })
  @IsString()
  @Matches(new RegExp(`(${CPF_REGEX.source})|(${CNPJ_REGEX.source})`), {
    message: 'Document must be a valid CPF or CNPJ',
  })
  document: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}