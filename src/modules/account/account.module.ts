import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountCreateService } from './services/account-create.service';

import { InMemoryCardRepository } from '@shared/tests/repositories/in-memory-card.repository';
import { AuthModule } from '../auth/auth.module';
import { AccountListService } from './services/account-list.service';
import { CardCreateService } from './services/card-create.service';

@Module({
  imports: [
    // DatabaseModule, 
    AuthModule
  ],
  controllers: [AccountController],
  providers: [
    AccountCreateService,
    AccountListService,
    CardCreateService,
    {
      provide: 'CardRepositoryInterface',
      useClass: InMemoryCardRepository,
    },
  ],
})
export class AccountModule { }