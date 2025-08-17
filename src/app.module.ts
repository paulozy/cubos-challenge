import { DatabaseModule } from '@infra/database/database.module';
import { Module } from '@nestjs/common';
import { GatewayModule } from './infraestructure/gateways/gateway.module';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { CardsModule } from './modules/cards/cards.module';
import { PeopleModule } from './modules/people/people.module';

@Module({
  imports: [
    DatabaseModule,
    GatewayModule,
    PeopleModule,
    AuthModule,
    AccountModule,
    CardsModule
  ],
})
export class AppModule { }
