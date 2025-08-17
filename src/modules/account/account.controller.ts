import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@shared/infraestructure/decorators/current-user.decorator';
import { Person } from 'src/modules/people/entities/person.entity';
import { JwtAuthGuard } from '../../infraestructure/auth/guards/jwt-auth.guard';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { CreateInternalTransactionDto } from './dto/create-internal-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ListTransactionsDto } from './dto/list-transactions.dto';
import { AccountBalanceService } from './services/account-balance.service';
import { AccountCreateService } from './services/account-create.service';
import { AccountListService } from './services/account-list.service';
import { CardCreateService } from './services/card-create.service';
import { CardListService } from './services/card-list.service';
import { TransactionCreateService } from './services/transaction-create.service';
import { TransactionInternalService } from './services/transaction-internal.service';
import { TransactionListService } from './services/transaction-list.service';
import { TransactionRevertService } from './services/transaction-revert.service';

@ApiTags('accounts')
@ApiBearerAuth()
@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(
    @Inject(AccountCreateService)
    private readonly accountCreateService: AccountCreateService,
    @Inject(AccountListService)
    private readonly accountListService: AccountListService,
    @Inject(CardCreateService)
    private readonly cardCreateService: CardCreateService,
    @Inject(CardListService)
    private readonly cardListService: CardListService,
    @Inject(TransactionCreateService)
    private readonly transactionCreateService: TransactionCreateService,
    @Inject(TransactionInternalService)
    private readonly transactionInternalService: TransactionInternalService,
    @Inject(TransactionListService)
    private readonly transactionListService: TransactionListService,
    @Inject(AccountBalanceService)
    private readonly accountBalanceService: AccountBalanceService,
    @Inject(TransactionRevertService)
    private readonly transactionRevertService: TransactionRevertService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'The account has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createAccountDto: CreateAccountDto,
    @CurrentUser() person: Person,
  ) {
    console.log("🚀 ~ AccountController ~ create ~ person:", person)
    const result = await this.accountCreateService.execute(
      createAccountDto,
      person.id,
    );
    if (result.isLeft()) throw result;
    return result.value.toJSON();
  }

  @Get()
  @ApiOperation({ summary: 'List all accounts for the current user' })
  @ApiResponse({ status: 200, description: 'A list of accounts.' })
  async findAll(@CurrentUser() person: Person) {
    const result = await this.accountListService.execute(person.id);
    if (result.isLeft()) throw result;
    return result.value.map((account) => account.toJSON());
  }

  @Get(':accountId/balance')
  @ApiOperation({ summary: 'Get the balance for a specific account' })
  @ApiResponse({ status: 200, description: 'The account balance.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  async getBalance(@Param('accountId') accountId: string) {
    const result = await this.accountBalanceService.execute(accountId);
    if (result.isLeft()) throw result;
    return result.value;
  }

  @Post(':accountId/cards')
  @ApiOperation({ summary: 'Create a new card for an account' })
  @ApiResponse({ status: 201, description: 'The card has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
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
  @ApiOperation({ summary: 'List all cards for a specific account' })
  @ApiResponse({ status: 200, description: 'A list of cards.' })
  async findAllCards(@Param('accountId') accountId: string) {
    const result = await this.cardListService.execute(accountId);
    if (result.isLeft()) throw result;
    return result.value.map((card) => card.toJSON());
  }

  @Post(':accountId/transactions')
  @ApiOperation({ summary: 'Create a new transaction for an account' })
  @ApiResponse({ status: 201, description: 'The transaction has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createTransaction(
    @Param('accountId') accountId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    const result = await this.transactionCreateService.execute(
      createTransactionDto,
      accountId,
    );
    if (result.isLeft()) throw result;
    return result.value.toJSON();
  }

  @Get(':accountId/transactions')
  @ApiOperation({ summary: 'List all transactions for a specific account' })
  @ApiResponse({ status: 200, description: 'A list of transactions.' })
  async findAllTransactions(
    @Param('accountId') accountId: string,
    @Query() query: ListTransactionsDto,
  ) {
    const result = await this.transactionListService.execute(accountId, query);
    if (result.isLeft()) {
      throw result.value;
    }
    return result.value;
  }

  @Post(':accountId/transactions/internal')
  @ApiOperation({ summary: 'Create a new internal transaction' })
  @ApiResponse({ status: 201, description: 'The internal transaction has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createInternalTransaction(
    @Param('accountId') accountId: string,
    @Body() createInternalTransactionDto: CreateInternalTransactionDto,
  ) {
    const result = await this.transactionInternalService.execute(
      createInternalTransactionDto,
      accountId,
    );
    if (result.isLeft()) throw result;
    return result.value.toJSON();
  }

  @Post(':accountId/transactions/:transactionId/revert')
  @ApiOperation({ summary: 'Revert a transaction' })
  @ApiResponse({ status: 200, description: 'The transaction has been successfully reverted.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async revertTransaction(
    @Param('accountId') accountId: string,
    @Param('transactionId') transactionId: string,
  ) {
    const result = await this.transactionRevertService.execute(
      transactionId,
      accountId,
    );
    if (result.isLeft()) throw result;
    return result.value.toJSON();
  }
}
