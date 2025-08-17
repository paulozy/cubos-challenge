import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryAccountRepository } from '@shared/tests/repositories/in-memory-account.repository';
import { InMemoryCardRepository } from '@shared/tests/repositories/in-memory-card.repository';
import { Account } from '../entities/account.entity';
import { Card, CardType } from '../entities/card.entity';
import { CardCreateService } from './card-create.service';

describe('CardCreateService', () => {
  let service: CardCreateService;
  let cardRepository: InMemoryCardRepository;
  let accountRepository: InMemoryAccountRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardCreateService,
        {
          provide: 'CardRepositoryInterface',
          useClass: InMemoryCardRepository,
        },
        {
          provide: 'AccountRepositoryInterface',
          useClass: InMemoryAccountRepository,
        },
      ],
    }).compile();

    service = module.get<CardCreateService>(CardCreateService);
    cardRepository = module.get<InMemoryCardRepository>(
      'CardRepositoryInterface',
    );
    accountRepository = module.get<InMemoryAccountRepository>(
      'AccountRepositoryInterface',
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a Left if the account is not found', async () => {
    const result = await service.execute(
      { type: CardType.VIRTUAL },
      'non-existent-account-id',
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
    expect(result.value).toEqual(new NotFoundException);
  });

  it('should save the card on success', async () => {
    const account = Account.create({
      branch: '001',
      account: '1234567-8',
      ownerId: 'owner-id',
    });
    accountRepository.accounts.push(account);

    const saveSpy = jest.spyOn(cardRepository, 'save');
    const result = await service.execute(
      { type: CardType.VIRTUAL },
      account.id,
    );

    expect(result.isRight()).toBe(true);
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should return a Right with the created card on success', async () => {
    const account = Account.create({
      branch: '001',
      account: '1234567-8',
      ownerId: 'owner-id',
    });
    accountRepository.accounts.push(account);

    const result = await service.execute(
      { type: CardType.VIRTUAL },
      account.id,
    );

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toBeInstanceOf(Card);
      expect(result.value.type).toBe(CardType.VIRTUAL);
      expect(result.value.accountId).toBe(account.id);
      expect(result.value.number).toHaveLength(16);
      expect(result.value.cvv).toHaveLength(3);
    }
  });
});
