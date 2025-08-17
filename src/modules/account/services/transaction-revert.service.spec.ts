import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryTransactionRepository } from '@shared/tests/repositories/in-memory-transaction.repository';
import {
  Transaction,
  TransactionType,
} from '../entities/transaction.entity';
import { TransactionRevertService } from './transaction-revert.service';
import { NotFoundException } from '@nestjs/common';

describe('TransactionRevertService', () => {
  let service: TransactionRevertService;
  let transactionRepository: InMemoryTransactionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRevertService,
        {
          provide: 'TransactionRepositoryInterface',
          useClass: InMemoryTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionRevertService>(TransactionRevertService);
    transactionRepository = module.get<InMemoryTransactionRepository>(
      'TransactionRepositoryInterface',
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a Left if the transaction is not found', async () => {
    const result = await service.execute('non-existent-id', 'account-id');
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should return a Left if the transaction belongs to another account', async () => {
    const transaction = Transaction.create({
      value: 100,
      description: 'Test',
      type: TransactionType.CREDIT,
      accountId: 'another-account-id',
    });
    transactionRepository.transactions.push(transaction);

    const result = await service.execute(transaction.id, 'account-id');
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
  });

  it('should return a Left if the transaction has already been reverted', async () => {
    const transaction = Transaction.create({
      value: 100,
      description: 'Test',
      type: TransactionType.CREDIT,
      accountId: 'account-id',
    });
    transaction.revert('revert-transaction-id');
    transactionRepository.transactions.push(transaction);

    const result = await service.execute(transaction.id, 'account-id');
    expect(result.isLeft()).toBe(true);
    expect((result.value as Error).message).toBe('Transaction already reverted');
  });

  it('should return a Left if there are insufficient funds to revert a credit transaction', async () => {
    const transactionToRevert = Transaction.create({
      value: 100,
      description: 'Initial Credit',
      type: TransactionType.CREDIT,
      accountId: 'account-id',
    });
    transactionRepository.transactions.push(transactionToRevert);

    const debitTransaction = Transaction.create({
      value: 60,
      description: 'A debit',
      type: TransactionType.DEBIT,
      accountId: 'account-id',
    });
    transactionRepository.transactions.push(debitTransaction);

    // Current balance is 100 - 60 = 40
    // Reverting the credit of 100 requires a balance of at least 100.

    const result = await service.execute(transactionToRevert.id, 'account-id');
    expect(result.isLeft()).toBe(true);
    expect((result.value as Error).message).toBe(
      'Insufficient funds to revert credit transaction',
    );
  });

  it('should revert a credit transaction successfully', async () => {
    const transaction = Transaction.create({
      value: 100,
      description: 'Test',
      type: TransactionType.CREDIT,
      accountId: 'account-id',
    });
    transactionRepository.transactions.push(transaction);

    const result = await service.execute(transaction.id, 'account-id');
    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const revertTransaction = result.value;
      expect(revertTransaction.type).toBe(TransactionType.DEBIT);
      expect(revertTransaction.value).toBe(100);
      expect(revertTransaction.description).toBe(
        `Revert of transaction ${transaction.id}`,
      );

      const originalTransaction = await transactionRepository.findById(
        transaction.id,
      );
      expect(originalTransaction?.revertedById).toBe(revertTransaction.id);
    }

    const balance = await transactionRepository.getBalance('account-id');
    expect(balance).toBe(0);
  });

  it('should revert a debit transaction successfully', async () => {
    transactionRepository.transactions.push(
      Transaction.create({
        value: 200,
        description: 'Initial Credit',
        type: TransactionType.CREDIT,
        accountId: 'account-id',
      }),
    );

    const transaction = Transaction.create({
      value: 100,
      description: 'Test',
      type: TransactionType.DEBIT,
      accountId: 'account-id',
    });
    transactionRepository.transactions.push(transaction);

    const result = await service.execute(transaction.id, 'account-id');
    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const revertTransaction = result.value;
      expect(revertTransaction.type).toBe(TransactionType.CREDIT);
      expect(revertTransaction.value).toBe(100);
    }

    const balance = await transactionRepository.getBalance('account-id');
    expect(balance).toBe(200);
  });
});
