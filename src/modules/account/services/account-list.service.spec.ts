import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryAccountRepository } from '@shared/tests/repositories/in-memory-account.repository';
import { Person } from '../../people/entities/person.entity';
import { Account } from '../entities/account.entity';
import { AccountListService } from './account-list.service';

describe('AccountListService', () => {
  let service: AccountListService;
  let accountRepository: InMemoryAccountRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountListService,
        {
          provide: 'AccountRepositoryInterface',
          useClass: InMemoryAccountRepository,
        },
      ],
    }).compile();

    service = module.get<AccountListService>(AccountListService);
    accountRepository = module.get<InMemoryAccountRepository>(
      'AccountRepositoryInterface',
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of accounts for a given owner', async () => {
    const owner = Person.create({
      name: 'John Doe',
      document: '12345678900',
      password: 'password',
    });

    const account1 = Account.create({
      branch: '001',
      account: '1234567-8',
      ownerId: owner.id,
    });
    const account2 = Account.create({
      branch: '001',
      account: '8765432-1',
      ownerId: owner.id,
    });
    accountRepository.accounts.push(account1, account2);

    const result = await service.execute(owner.id);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toHaveLength(2);
      expect(result.value[0]).toBeInstanceOf(Account);
    }
  });

  it('should return an empty list if the owner has no accounts', async () => {
    const result = await service.execute('non-existent-owner-id');

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toHaveLength(0);
    }
  });
});
