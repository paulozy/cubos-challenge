import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountCreateService } from './services/account-create.service';

import { InMemoryCardRepository } from '@shared/tests/repositories/in-memory-card.repository';
import { AuthModule } from '../auth/auth.module';
import { AccountListService } from './services/account-list.service';
import { CardCreateService } from './services/card-create.service';
import { CardListService } from './services/card-list.service';
import { TransactionCreateService } from './services/transaction-create.service';
import { InMemoryTransactionRepository } from '@shared/tests/repositories/in-memory-transaction.repository';
import { InMemoryAccountRepository } from '@shared/tests/repositories/in-memory-account.repository';
import { TransactionInternalService } from './services/transaction-internal.service';
import { TransactionListService } from './services/transaction-list.service';
import { AccountBalanceService } from './services/account-balance.service';
import { TransactionRevertService } from './services/transaction-revert.service';

@Module({
  imports: [
    // DatabaseModule,
    AuthModule,
  ],
  controllers: [AccountController],
  providers: [
    AccountCreateService,
    AccountListService,
    CardCreateService,
    CardListService,
    TransactionCreateService,
    TransactionInternalService,
    TransactionListService,
    AccountBalanceService,
    TransactionRevertService,
    {
      provide: 'CardRepositoryInterface',
      useClass: InMemoryCardRepository,
    },
    {
      provide: 'TransactionRepositoryInterface',
      useClass: InMemoryTransactionRepository,
    },
    {
      provide: 'AccountRepositoryInterface',
      useClass: InMemoryAccountRepository,
    },
  ],
})
export class AccountModule {}
