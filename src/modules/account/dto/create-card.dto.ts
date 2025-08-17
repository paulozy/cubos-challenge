import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { CardType } from '../entities/card.entity';

export const CreateCardSchema = z.object({
  type: z.nativeEnum(CardType),
});

export class CreateCardDto extends createZodDto(CreateCardSchema) {}
