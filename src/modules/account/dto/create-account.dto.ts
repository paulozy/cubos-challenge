import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const CreateAccountSchema = z.object({
  branch: z.string().length(3, { message: 'Branch must be 3 characters long' }),
  account: z.string().regex(/^\d{7}-\d{1}$/, { message: 'Account must be in the format ddddddd-d' })
});

export class CreateAccountDto extends createZodDto(CreateAccountSchema) { }