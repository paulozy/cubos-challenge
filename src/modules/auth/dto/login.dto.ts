import { IsString, Matches } from 'class-validator';
import { CNPJ_REGEX, CPF_REGEX } from '@shared/constants';

export class LoginDto {
  @IsString()
  @Matches(new RegExp(`(${CPF_REGEX.source})|(${CNPJ_REGEX.source})`), {
    message: 'Document must be a valid CPF or CNPJ',
  })
  document: string;

  @IsString()
  password: string;
}
