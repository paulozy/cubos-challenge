import { createZodDto } from '@anatine/zod-nestjs';
import { CNPJ_REGEX, CPF_REGEX } from '@shared/constants';
import { z } from 'zod';

export const CreatePersonSchema = z.object({
  name: z.string(),
  document: z.string().refine(
    (val) => CPF_REGEX.test(val) || CNPJ_REGEX.test(val),
    { message: 'Document must be a valid CPF or CNPJ' }
  ),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
});

export class CreatePersonDto extends createZodDto(CreatePersonSchema) { }