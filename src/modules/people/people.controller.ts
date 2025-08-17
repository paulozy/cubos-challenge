import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { PeopleCreateService } from './services/people-create.service';

@Controller('people')
@UsePipes(ZodValidationPipe)
export class PeopleController {
  constructor(
    @Inject(PeopleCreateService)
    private readonly createService: PeopleCreateService,
  ) {}

  @Post()
  async create(@Body() createPersonDto: CreatePersonDto) {
    const result = await this.createService.execute(createPersonDto);
    if (result.isLeft()) throw result;
    return result.value.toJSON();
  }
}