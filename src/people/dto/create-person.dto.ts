import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/;

export const CreatePersonSchema = z.object({
  name: z.string(),
  document: z.string().refine(
    (val) => cpfRegex.test(val) || cnpjRegex.test(val),
    { message: 'Document must be a valid CPF or CNPJ' }
  ),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
});

export class CreatePersonDto extends createZodDto(CreatePersonSchema) { }