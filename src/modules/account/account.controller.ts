import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { CurrentUser } from '@shared/infraestructure/decorators/current-user.decorator';
import { Person } from 'src/modules/people/entities/person.entity';
import { JwtAuthGuard } from '../../infraestructure/auth/guards/jwt-auth.guard';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { AccountCreateService } from './services/account-create.service';
import { AccountListService } from './services/account-list.service';
import { CardCreateService } from './services/card-create.service';
import { CardListService } from './services/card-list.service';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
@UsePipes(ZodValidationPipe)
export class AccountController {
  constructor(
    private readonly accountCreateService: AccountCreateService,
    private readonly accountListService: AccountListService,
    private readonly cardCreateService: CardCreateService,
    private readonly cardListService: CardListService,
  ) { }

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto, @CurrentUser() person: Person) {
    const result = await this.accountCreateService.execute(createAccountDto, person.id);
    if (result.isLeft()) throw result;
    return result.value.toJSON();
  }

  @Get()
  async findAll(@CurrentUser() person: Person) {
    const result = await this.accountListService.execute(person.id);
    if (result.isLeft()) throw result;
    return result.value.map(account => account.toJSON());
  }

  @Post(':accountId/cards')
  async createCard(
    @Param('accountId') accountId: string,
    @Body() createCardDto: CreateCardDto,
  ) {
    const result = await this.cardCreateService.execute(
      createCardDto,
      accountId,
    );
    if (result.isLeft()) throw result;
    return result.value.toJSON();
  }

  @Get(':accountId/cards')
  async findAllCards(@Param('accountId') accountId: string) {
    const result = await this.cardListService.execute(accountId);
    if (result.isLeft()) throw result;
    return result.value.map(card => card.toJSON());
  }
}