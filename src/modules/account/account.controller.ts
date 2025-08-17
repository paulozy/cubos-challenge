import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { CurrentUser } from '@shared/infraestructure/decorators/current-user.decorator';
import { Person } from 'src/modules/people/entities/person.entity';
import { JwtAuthGuard } from '../../infraestructure/auth/guards/jwt-auth.guard';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountCreateService } from './services/account-create.service';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
@UsePipes(ZodValidationPipe)
export class AccountController {
  constructor(
    private readonly accountCreateService: AccountCreateService
  ) { }

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto, @CurrentUser() person: Person) {
    const result = await this.accountCreateService.execute(createAccountDto, person.id);
    if (result.isLeft()) throw result;
    return result.value.toJSON();
  }
}