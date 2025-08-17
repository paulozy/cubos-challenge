import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryAccountRepository } from '@shared/tests/repositories/in-memory-account.repository';
import { InMemoryTransactionRepository } from '@shared/tests/repositories/in-memory-transaction.repository';
import { Account } from '../entities/account.entity';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { TransactionListService } from './transaction-list.service';

describe('TransactionListService', () => {
  let service: TransactionListService;
  let transactionRepository: InMemoryTransactionRepository;
  let accountRepository: InMemoryAccountRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionListService,
        {
          provide: 'TransactionRepositoryInterface',
          useClass: InMemoryTransactionRepository,
        },
        {
          provide: 'AccountRepositoryInterface',
          useClass: InMemoryAccountRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionListService>(TransactionListService);
    transactionRepository = module.get<InMemoryTransactionRepository>(
      'TransactionRepositoryInterface',
    );
    accountRepository = module.get<InMemoryAccountRepository>(
      'AccountRepositoryInterface',
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a Left if the account is not found', async () => {
    const result = await service.execute('non-existent-account-id', {
      itemsPerPage: 10,
      currentPage: 1,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should return a paginated list of transactions', async () => {
    const account = Account.create({
      branch: '001',
      account: '1234567-8',
      ownerId: 'owner-id',
    });
    accountRepository.accounts.push(account);

    for (let i = 0; i < 20; i++) {
      transactionRepository.transactions.push(
        Transaction.create({
          value: 100,
          description: `Transaction ${i}`,
          type: i % 2 === 0 ? TransactionType.CREDIT : TransactionType.DEBIT,
          accountId: account.id,
        }),
      );
    }

    const result = await service.execute(account.id, {
      itemsPerPage: 5,
      currentPage: 2,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const { data, total, itemsPerPage, currentPage, totalPages } =
        result.value;
      expect(data).toHaveLength(5);
      expect(total).toBe(20);
      expect(itemsPerPage).toBe(5);
      expect(currentPage).toBe(2);
      expect(totalPages).toBe(4);
    }
  });

  it('should filter transactions by type', async () => {
    const account = Account.create({
      branch: '001',
      account: '1234567-8',
      ownerId: 'owner-id',
    });
    accountRepository.accounts.push(account);

    for (let i = 0; i < 20; i++) {
      transactionRepository.transactions.push(
        Transaction.create({
          value: 100,
          description: `Transaction ${i}`,
          type: i % 2 === 0 ? TransactionType.CREDIT : TransactionType.DEBIT,
          accountId: account.id,
        }),
      );
    }

    const result = await service.execute(account.id, {
      itemsPerPage: 10,
      currentPage: 1,
      type: TransactionType.CREDIT,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const { data, total } = result.value;
      expect(data).toHaveLength(10);
      expect(total).toBe(10);
      data.forEach((t) => expect(t.type).toBe(TransactionType.CREDIT));
    }
  });
});
