import { Card } from "@modules/account/entities/card.entity";

export interface CardRepositoryInterface {
  save(card: Card): Promise<void>;
}
