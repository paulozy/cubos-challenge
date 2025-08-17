import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryCardRepository } from '@shared/tests/repositories/in-memory-card.repository';
import { Card, CardType } from '../entities/card.entity';
import { CardListService } from './card-list.service';

describe('CardListService', () => {
  let service: CardListService;
  let cardRepository: InMemoryCardRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardListService,
        {
          provide: 'CardRepositoryInterface',
          useClass: InMemoryCardRepository,
        },
      ],
    }).compile();

    service = module.get<CardListService>(CardListService);
    cardRepository = module.get<InMemoryCardRepository>(
      'CardRepositoryInterface',
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of cards for a given account', async () => {
    const card1 = Card.create({
      type: CardType.VIRTUAL,
      number: '1234567890123456',
      cvv: '123',
      accountId: 'account-id',
    });
    const card2 = Card.create({
      type: CardType.PHYSICAL,
      number: '9876543210987654',
      cvv: '321',
      accountId: 'account-id',
    });
    cardRepository.cards.push(card1, card2);

    const result = await service.execute('account-id');

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toHaveLength(2);
      expect(result.value[0]).toBeInstanceOf(Card);
    }
  });

  it('should return an empty list if the account has no cards', async () => {
    const result = await service.execute('non-existent-account-id');

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toHaveLength(0);
    }
  });
});
