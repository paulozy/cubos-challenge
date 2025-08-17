import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryCardRepository } from '@shared/tests/repositories/in-memory-card.repository';
import { Card, CardType } from '../../account/entities/card.entity';
import { CardListByPersonService } from './card-list-by-person.service';

describe('CardListByPersonService', () => {
  let service: CardListByPersonService;
  let cardRepository: InMemoryCardRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardListByPersonService,
        {
          provide: 'CardRepositoryInterface',
          useClass: InMemoryCardRepository,
        },
      ],
    }).compile();

    service = module.get<CardListByPersonService>(CardListByPersonService);
    cardRepository = module.get<InMemoryCardRepository>(
      'CardRepositoryInterface',
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a paginated list of cards for a given person', async () => {
    for (let i = 0; i < 20; i++) {
      cardRepository.cards.push(
        Card.create({
          type: CardType.VIRTUAL,
          number: `123456789012345${i}`,
          cvv: '123',
          accountId: `account-${i}`,
        }),
      );
    }

    const result = await service.execute({
      personId: 'person-id',
      itemsPerPage: 5,
      currentPage: 2,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.data).toHaveLength(5);
      expect(result.value.total).toBe(20);
      expect(result.value.currentPage).toBe(2);
      expect(result.value.totalPages).toBe(4);
      expect(result.value.data[0].number).toContain('****');
    }
  });
});