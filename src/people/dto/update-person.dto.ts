import { createZodDto } from '@anatine/zod-nestjs';
import { CreatePersonSchema } from './create-person.dto';

export class UpdatePersonDto extends createZodDto(CreatePersonSchema.partial()) {}