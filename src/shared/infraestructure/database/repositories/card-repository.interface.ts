import { Card } from "@modules/account/entities/card.entity";

export interface CardRepositoryInterface {
  save(card: Card): Promise<void>;
  findByAccountId(accountId: string): Promise<Card[]>;
  findByPersonId(personId: string): Promise<Card[]>;
}
