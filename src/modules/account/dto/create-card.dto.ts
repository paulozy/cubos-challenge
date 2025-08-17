import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { CardType } from '../entities/card.entity';

export const CreateCardSchema = z.object({
  type: z.nativeEnum(CardType),
  number: z.string().min(13).max(19).optional(),
  cvv: z.string().min(3).max(3).optional(),
});

export class CreateCardDto extends createZodDto(CreateCardSchema) { }
