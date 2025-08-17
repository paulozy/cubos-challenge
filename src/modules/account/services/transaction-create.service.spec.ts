import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryAccountRepository } from '@shared/tests/repositories/in-memory-account.repository';
import { InMemoryTransactionRepository } from '@shared/tests/repositories/in-memory-transaction.repository';
import { Account } from '../entities/account.entity';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { TransactionCreateService } from './transaction-create.service';

describe('TransactionCreateService', () => {
  let service: TransactionCreateService;
  let transactionRepository: InMemoryTransactionRepository;
  let accountRepository: InMemoryAccountRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionCreateService,
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

    service = module.get<TransactionCreateService>(TransactionCreateService);
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
    const result = await service.execute(
      {
        value: 100,
        description: 'Test',
        type: TransactionType.CREDIT,
      },
      'non-existent-account-id',
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should return a Left if there are insufficient funds for a debit transaction', async () => {
    const account = Account.create({
      branch: '001',
      account: '1234567-8',
      ownerId: 'owner-id',
    });
    accountRepository.accounts.push(account);

    const getBalanceSpy = jest.spyOn(transactionRepository, 'getBalance');

    const result = await service.execute(
      {
        value: 100,
        description: 'Test',
        type: TransactionType.DEBIT,
      },
      account.id,
    );

    expect(result.isLeft()).toBe(true);
    expect(getBalanceSpy).toHaveBeenCalledWith(account.id);
    expect(result.value).toBeInstanceOf(Error);
    expect((result.value as Error).message).toBe('Insufficient funds');

    const transactions = await transactionRepository.findByAccountId(account.id);
    expect(transactions).toHaveLength(0);
  });

  it('should create a credit transaction successfully', async () => {
    const account = Account.create({
      branch: '001',
      account: '1234567-8',
      ownerId: 'owner-id',
    });
    accountRepository.accounts.push(account);

    const getBalanceSpy = jest.spyOn(transactionRepository, 'getBalance');

    const result = await service.execute(
      {
        value: 100,
        description: 'Test',
        type: TransactionType.CREDIT,
      },
      account.id,
    );

    expect(result.isRight()).toBe(true);
    expect(getBalanceSpy).not.toHaveBeenCalled();
    if (result.isRight()) {
      expect(result.value).toBeInstanceOf(Transaction);
      expect(result.value.value).toBe(100);
      expect(result.value.type).toBe(TransactionType.CREDIT);
    }

    const finalBalance = await transactionRepository.getBalance(account.id);
    expect(finalBalance).toBe(100);
  });

  it('should create a debit transaction successfully', async () => {
    const account = Account.create({
      branch: '001',
      account: '1234567-8',
      ownerId: 'owner-id',
    });
    accountRepository.accounts.push(account);

    await service.execute(
      {
        value: 200,
        description: 'Initial credit',
        type: TransactionType.CREDIT,
      },
      account.id,
    );

    const getBalanceSpy = jest.spyOn(transactionRepository, 'getBalance');

    const result = await service.execute(
      {
        value: 100,
        description: 'Debit transaction',
        type: TransactionType.DEBIT,
      },
      account.id,
    );

    expect(result.isRight()).toBe(true);
    expect(getBalanceSpy).toHaveBeenCalledWith(account.id);
    if (result.isRight()) {
      expect(result.value).toBeInstanceOf(Transaction);
      expect(result.value.value).toBe(100);
      expect(result.value.type).toBe(TransactionType.DEBIT);
    }

    const finalBalance = await transactionRepository.getBalance(account.id);
    expect(finalBalance).toBe(100);
  });
});
