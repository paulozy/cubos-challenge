import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@shared/infraestructure/decorators/current-user.decorator';
import { Person } from '../people/entities/person.entity';
import { JwtAuthGuard } from 'src/infraestructure/auth/guards/jwt-auth.guard';
import { CardListByPersonService } from './services/card-list-by-person.service';

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(
    private readonly cardListByPersonService: CardListByPersonService,
  ) {}

  @Get()
  async findAll(
    @CurrentUser() person: Person,
    @Query('itemsPerPage') itemsPerPage?: number,
    @Query('currentPage') currentPage?: number,
  ) {
    const result = await this.cardListByPersonService.execute({
      personId: person.id,
      itemsPerPage,
      currentPage,
    });

    if (result.isLeft()) {
      throw result.value;
    }

    return result.value;
  }
}