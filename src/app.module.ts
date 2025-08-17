import { Module } from '@nestjs/common';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { PeopleModule } from './modules/people/people.module';

@Module({
  imports: [PeopleModule, AuthModule, AccountModule],
})
export class AppModule { }
