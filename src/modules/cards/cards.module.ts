import { DatabaseModule } from '@infra/database/database.module';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CardsController } from './cards.controller';
import { CardListByPersonService } from './services/card-list-by-person.service';

@Module({
  imports: [
    DatabaseModule,
    AuthModule
  ],
  controllers: [CardsController],
  providers: [CardListByPersonService],
})
export class CardsModule { }