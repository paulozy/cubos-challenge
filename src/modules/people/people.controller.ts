import {
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { PeopleCreateService } from './services/people-create.service';

@Controller('people')
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