import { Module } from '@nestjs/common';
import { InMemoryCardRepository } from '@shared/tests/repositories/in-memory-card.repository';
import { AuthModule } from '../auth/auth.module';
import { CardsController } from './cards.controller';
import { CardListByPersonService } from './services/card-list-by-person.service';

@Module({
  imports: [AuthModule],
  controllers: [CardsController],
  providers: [
    CardListByPersonService,
    {
      provide: 'CardRepositoryInterface',
      useClass: InMemoryCardRepository,
    },
  ],
})
export class CardsModule {}