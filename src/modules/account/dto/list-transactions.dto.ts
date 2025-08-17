import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { TransactionType } from '../entities/transaction.entity';

export const ListTransactionsSchema = z.object({
  itemsPerPage: z.coerce.number().int().positive().default(10),
  currentPage: z.coerce.number().int().positive().default(1),
  type: z.nativeEnum(TransactionType).optional(),
});

export class ListTransactionsDto extends createZodDto(ListTransactionsSchema) {}
