import { CardRepositoryInterface } from '@shared/infraestructure/database/repositories/card-repository.interface';
import { Card } from 'src/modules/account/entities/card.entity';

export class InMemoryCardRepository implements CardRepositoryInterface {
  public cards: Card[] = [];

  async save(card: Card): Promise<void> {
    this.cards.push(card);
  }
}
