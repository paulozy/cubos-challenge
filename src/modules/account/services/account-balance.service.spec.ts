import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryAccountRepository } from '@shared/tests/repositories/in-memory-account.repository';
import { Account } from '../entities/account.entity';
import { AccountBalanceService } from './account-balance.service';
import { Person } from '../../people/entities/person.entity';
import { InMemoryTransactionRepository } from '@shared/tests/repositories/in-memory-transaction.repository';
import {
  Transaction,
  TransactionType,
} from '../entities/transaction.entity';

describe('AccountBalanceService', () => {
  let service: AccountBalanceService;
  let accountRepository: InMemoryAccountRepository;
  let transactionRepository: InMemoryTransactionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountBalanceService,
        {
          provide: 'AccountRepositoryInterface',
          useClass: InMemoryAccountRepository,
        },
        {
          provide: 'TransactionRepositoryInterface',
          useClass: InMemoryTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<AccountBalanceService>(AccountBalanceService);
    accountRepository = module.get<InMemoryAccountRepository>(
      'AccountRepositoryInterface',
    );
    transactionRepository = module.get<InMemoryTransactionRepository>(
      'TransactionRepositoryInterface',
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the balance of an existing account', async () => {
    const owner = Person.create({
      name: 'John Doe',
      document: '12345678900',
      password: 'password',
    });

    const account = Account.create({
      branch: '001',
      account: '1234567-8',
      ownerId: owner.id,
    });
    accountRepository.accounts.push(account);

    const creditTransaction = Transaction.create({
      value: 100,
      description: 'Deposit',
      type: TransactionType.CREDIT,
      accountId: account.id,
    });

    const debitTransaction = Transaction.create({
      value: 50,
      description: 'Withdraw',
      type: TransactionType.DEBIT,
      accountId: account.id,
    });

    transactionRepository.transactions.push(
      creditTransaction,
      debitTransaction,
    );

    const result = await service.execute(account.id);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.balance).toBe(50);
    }
  });

  it('should return an error if the account does not exist', async () => {
    const result = await service.execute('non-existent-account-id');

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value.message).toBe('Account not found');
    }
  });

  it('should return a balance of 0 if there are no transactions', async () => {
    const owner = Person.create({
      name: 'John Doe',
      document: '12345678900',
      password: 'password',
    });

    const account = Account.create({
      branch: '001',
      account: '1234567-8',
      ownerId: owner.id,
    });
    accountRepository.accounts.push(account);

    const result = await service.execute(account.id);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.balance).toBe(0);
    }
  });
});