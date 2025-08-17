import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Either, left, right } from '@shared/domain/either';
import { AccountRepositoryInterface } from '@shared/infraestructure/database/repositories/account-repository.interface';
import { CardRepositoryInterface } from '@shared/infraestructure/database/repositories/card-repository.interface';
import { CreateCardDto } from '../dto/create-card.dto';
import { Card, CardType } from '../entities/card.entity';

type CreateCardResponse = Either<Error, Card>;

@Injectable()
export class CardCreateService {
  constructor(
    @Inject('CardRepositoryInterface')
    private readonly cardRepository: CardRepositoryInterface,
    @Inject('AccountRepositoryInterface')
    private readonly accountRepository: AccountRepositoryInterface,
  ) { }

  async execute(
    payload: CreateCardDto,
    accountId: string,
  ): Promise<CreateCardResponse> {
    let { type, number, cvv } = payload

    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      return left(new NotFoundException);
    }

    if (type === CardType.PHYSICAL) {
      const cards = await this.cardRepository.findByAccountId(account.id)
      const hasPhysicalCard = cards.some(card => card.type === CardType.PHYSICAL)
      if (hasPhysicalCard) return left(new Error('An account can have only one physical card.'))
    }

    const card = Card.create({
      ...payload,
      accountId,
      number: number ?? this.generateCardNumber(),
      cvv: cvv ?? this.generateCVV()
    });

    await this.cardRepository.save(card);

    return right(card);
  }

  private generateCardNumber() {
    return Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 10),
    ).join('');
  }

  private generateCVV() {
    return Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 10),
    ).join('');
  }
}
