import { Card, CardType } from '@modules/account/entities/card.entity';
import {
  Card as PrismaCard,
  CardType as PrismaCardType,
} from '@prisma/client';

export class PrismaCardMapper {
  static toDomain(raw: PrismaCard): Card {
    return Card.create({
      id: raw.id,
      type: raw.type === PrismaCardType.VIRTUAL ? CardType.VIRTUAL : CardType.PHYSICAL,
      number: raw.number,
      cvv: raw.cvv,
      accountId: raw.accountId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPrisma(card: Card) {
    return {
      id: card.id,
      type: card.type === CardType.VIRTUAL ? PrismaCardType.VIRTUAL : PrismaCardType.PHYSICAL,
      number: card.number,
      cvv: card.cvv,
      accountId: card.accountId,
    };
  }
}
