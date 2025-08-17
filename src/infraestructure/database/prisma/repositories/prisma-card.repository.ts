import { Card } from '@modules/account/entities/card.entity';
import { Inject, Injectable } from '@nestjs/common';
import { CardRepositoryInterface } from '@shared/infraestructure/database/repositories/card-repository.interface';
import { PrismaCardMapper } from '../mappers/prisma-card.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaCardRepository implements CardRepositoryInterface {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService
  ) { }

  async save(card: Card): Promise<void> {
    const data = PrismaCardMapper.toPrisma(card);
    await this.prisma.card.create({ data });
  }

  async findByAccountId(accountId: string): Promise<Card[]> {
    const cards = await this.prisma.card.findMany({
      where: { accountId },
    });
    return cards.map(PrismaCardMapper.toDomain);
  }

  async findByPersonId(personId: string): Promise<Card[]> {
    const cards = await this.prisma.card.findMany({
      where: {
        account: {
          ownerId: personId,
        },
      },
    });
    return cards.map(PrismaCardMapper.toDomain);
  }
}
