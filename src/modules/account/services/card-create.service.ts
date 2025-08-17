import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Either, left, right } from '@shared/domain/either';
import { AccountRepositoryInterface } from '@shared/infraestructure/database/repositories/account-repository.interface';
import { CardRepositoryInterface } from '@shared/infraestructure/database/repositories/card-repository.interface';
import { CreateCardDto } from '../dto/create-card.dto';
import { Card } from '../entities/card.entity';

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
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      return left(new NotFoundException);
    }

    const cardNumber = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 10),
    ).join('');
    const cvv = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 10),
    ).join('');

    const card = Card.create({
      ...payload,
      accountId,
      number: cardNumber,
      cvv,
    });

    await this.cardRepository.save(card);

    return right(card);
  }
}
