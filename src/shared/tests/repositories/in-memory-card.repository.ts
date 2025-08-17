import { CardRepositoryInterface } from '@shared/infraestructure/database/repositories/card-repository.interface';
import { Card } from 'src/modules/account/entities/card.entity';

export class InMemoryCardRepository implements CardRepositoryInterface {
  public cards: Card[] = [];

  async save(card: Card): Promise<void> {
    this.cards.push(card);
  }

  async findByAccountId(accountId: string): Promise<Card[]> {
    return this.cards.filter(c => c.accountId === accountId);
  }

  async findByPersonId(personId: string): Promise<Card[]> {
    // This is a mock implementation. In a real scenario, you would have a relationship between person and cards.
    return this.cards;
  }
}
