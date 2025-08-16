import { createZodDto } from '@anatine/zod-nestjs';
import { CNPJ_REGEX, CPF_REGEX } from '@shared/constants';
import { z } from 'zod';

export const LoginSchema = z.object({
  document: z.string().refine(
    (val) => CPF_REGEX.test(val) || CNPJ_REGEX.test(val),
    { message: 'Document must be a valid CPF or CNPJ' }
  ),
  password: z.string(),
});

export class LoginDto extends createZodDto(LoginSchema) { }
