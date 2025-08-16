import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  Body,
  Controller,
  Post,
  UsePipes
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { PeopleCreateService } from './services/people-create.service';

@Controller('people')
@UsePipes(ZodValidationPipe)
export class PeopleController {
  constructor(
    private readonly createService: PeopleCreateService
  ) { }

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.createService.execute(createPersonDto);
  }
}