import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { TransactionType } from '../entities/transaction.entity';

export const CreateTransactionSchema = z.object({
  value: z.number().positive(),
  description: z.string().min(1),
  cardId: z.string().uuid().optional(),
  type: z.nativeEnum(TransactionType),
});

export class CreateTransactionDto extends createZodDto(
  CreateTransactionSchema,
) {}
