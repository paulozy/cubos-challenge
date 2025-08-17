import { Card } from '@modules/account/entities/card.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Either, right } from '@shared/domain/either';
import { CardRepositoryInterface } from '@shared/infraestructure/database/repositories/card-repository.interface';

type CardListByPersonRequest = {
  personId: string;
  itemsPerPage?: number;
  currentPage?: number;
};

type MaskedCard = {
  number: string;
  id: string;
  type: Card['type'];
  cvv: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
};

type PaginatedCards = {
  data: MaskedCard[];
  total: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
};

type CardListByPersonResponse = Either<Error, PaginatedCards>;

@Injectable()
export class CardListByPersonService {
  constructor(
    @Inject('CardRepositoryInterface')
    private readonly cardRepository: CardRepositoryInterface,
  ) { }

  async execute({
    personId,
    itemsPerPage = 10,
    currentPage = 1,
  }: CardListByPersonRequest): Promise<CardListByPersonResponse> {
    const cards = await this.cardRepository.findByPersonId(personId);

    const total = cards.length;
    const totalPages = Math.ceil(total / itemsPerPage);
    const paginatedCards = cards.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );

    const maskedCards = paginatedCards.map(card => {
      const lastFourDigits = card.number.slice(-4);
      return {
        ...card.toJSON(),
        number: `**** **** **** ${lastFourDigits}`,
      };
    });

    return right({
      data: maskedCards,
      total,
      itemsPerPage,
      currentPage,
      totalPages,
    });
  }
}