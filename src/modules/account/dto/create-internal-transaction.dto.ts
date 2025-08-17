import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const CreateInternalTransactionSchema = z.object({
  receiverAccountId: z.string().uuid(),
  value: z.number().positive(),
  description: z.string().min(1),
});

export class CreateInternalTransactionDto extends createZodDto(
  CreateInternalTransactionSchema,
) {}
