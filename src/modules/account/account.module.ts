import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountCreateService } from './services/account-create.service';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // DatabaseModule, 
    AuthModule
  ],
  controllers: [AccountController],
  providers: [AccountCreateService],
})
export class AccountModule { }