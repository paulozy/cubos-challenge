import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryAccountRepository } from '@shared/tests/repositories/in-memory-account.repository';
import { InMemoryPeopleRepository } from '@shared/tests/repositories/in-memory-people.repository';
import { Person } from '../../people/entities/person.entity';
import { Account } from '../entities/account.entity';
import { AccountCreateService } from './account-create.service';

describe('AccountCreateService', () => {
  let service: AccountCreateService;
  let accountRepository: InMemoryAccountRepository;
  let peopleRepository: InMemoryPeopleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountCreateService,
        {
          provide: 'AccountRepositoryInterface',
          useClass: InMemoryAccountRepository,
        },
        {
          provide: 'PeopleRepositoryInterface',
          useClass: InMemoryPeopleRepository,
        },
      ],
    }).compile();

    service = module.get<AccountCreateService>(AccountCreateService);
    accountRepository = module.get<InMemoryAccountRepository>(
      'AccountRepositoryInterface',
    );
    peopleRepository = module.get<InMemoryPeopleRepository>(
      'PeopleRepositoryInterface',
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a Left if the owner is not found', async () => {
    const result = await service.execute(
      { branch: '001', account: '1234567-8' },
      'non-existent-owner-id',
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
    expect(result.value).toEqual(new Error('Owner not found'));
  });

  it('should return a Left if the account already exists', async () => {
    const owner = Person.create({
      name: 'John Doe',
      document: '12345678900',
      password: 'password',
    });
    peopleRepository.people.push(owner);

    const account = Account.create({
      branch: '001',
      account: '1234567-8',
      ownerId: owner.id,
    });
    accountRepository.accounts.push(account);

    const result = await service.execute(
      { branch: '001', account: '1234567-8' },
      owner.id,
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
    expect(result.value).toEqual(new Error('Account already exists'));
  });

  it('should save the account on success', async () => {
    const owner = Person.create({
      name: 'John Doe',
      document: '12345678900',
      password: 'password',
    });
    peopleRepository.people.push(owner);

    const saveSpy = jest.spyOn(accountRepository, 'save');
    const result = await service.execute(
      { branch: '001', account: '1234567-8' },
      owner.id,
    );

    expect(result.isRight()).toBe(true);
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should return a Right with the created account on success', async () => {
    const owner = Person.create({
      name: 'John Doe',
      document: '12345678900',
      password: 'password',
    });
    peopleRepository.people.push(owner);

    const result = await service.execute(
      { branch: '001', account: '1234567-8' },
      owner.id,
    );

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toBeInstanceOf(Account);
      expect(result.value.branch).toBe('001');
      expect(result.value.account).toBe('1234567-8');
      expect(result.value.ownerId).toBe(owner.id);
    }
  });
});
