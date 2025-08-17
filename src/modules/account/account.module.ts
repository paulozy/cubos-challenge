import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountCreateService } from './services/account-create.service';

import { DatabaseModule } from '@infra/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { AccountBalanceService } from './services/account-balance.service';
import { AccountListService } from './services/account-list.service';
import { CardCreateService } from './services/card-create.service';
import { CardListService } from './services/card-list.service';
import { TransactionCreateService } from './services/transaction-create.service';
import { TransactionInternalService } from './services/transaction-internal.service';
import { TransactionListService } from './services/transaction-list.service';
import { TransactionRevertService } from './services/transaction-revert.service';

@Module({
  imports: [DatabaseModule, AuthModule],
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
  ],
})
export class AccountModule { }
