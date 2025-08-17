import { Inject, Injectable } from '@nestjs/common';
import { Either, right } from '@shared/domain/either';
import { CardRepositoryInterface } from '@shared/infraestructure/database/repositories/card-repository.interface';
import { Card } from '../entities/card.entity';

type ListCardsResponse = Either<Error, Card[]>;

@Injectable()
export class CardListService {
  constructor(
    @Inject('CardRepositoryInterface')
    private readonly cardRepository: CardRepositoryInterface,
  ) {}

  async execute(accountId: string): Promise<ListCardsResponse> {
    const cards = await this.cardRepository.findByAccountId(accountId);
    return right(cards);
  }
}
