import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePersonDto } from './dto/create-person.dto';
import { PeopleCreateService } from './services/people-create.service';

@ApiTags('people')
@Controller('people')
export class PeopleController {
  constructor(
    @Inject(PeopleCreateService)
    private readonly createService: PeopleCreateService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new person' })
  @ApiResponse({ status: 201, description: 'The person has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createPersonDto: CreatePersonDto) {
    const result = await this.createService.execute(createPersonDto);
    if (result.isLeft()) throw result;
    return result.value.toJSON();
  }
}