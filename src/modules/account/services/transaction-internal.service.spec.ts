import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryAccountRepository } from '@shared/tests/repositories/in-memory-account.repository';
import { InMemoryTransactionRepository } from '@shared/tests/repositories/in-memory-transaction.repository';
import { Account } from '../entities/account.entity';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { TransactionInternalService } from './transaction-internal.service';

describe('TransactionInternalService', () => {
  let service: TransactionInternalService;
  let transactionRepository: InMemoryTransactionRepository;
  let accountRepository: InMemoryAccountRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionInternalService,
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

    service = module.get<TransactionInternalService>(
      TransactionInternalService,
    );
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

  it('should return a Left if sender and receiver accounts are the same', async () => {
    const accountId = 'some-account-id';
    const result = await service.execute(
      {
        receiverAccountId: accountId,
        value: 100,
        description: 'Test',
      },
      accountId,
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
    expect((result.value as Error).message).toBe(
      'Sender and receiver accounts cannot be the same',
    );
  });

  it('should return a Left if the sender account is not found', async () => {
    const result = await service.execute(
      {
        receiverAccountId: 'receiver-id',
        value: 100,
        description: 'Test',
      },
      'non-existent-sender-id',
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
    expect((result.value as NotFoundException).message).toBe(
      'Sender account not found',
    );
  });

  it('should return a Left if the receiver account is not found', async () => {
    const sender = Account.create({
      branch: '001',
      account: '1234567-8',
      ownerId: 'owner-id',
    });
    accountRepository.accounts.push(sender);

    const result = await service.execute(
      {
        receiverAccountId: 'non-existent-receiver-id',
        value: 100,
        description: 'Test',
      },
      sender.id,
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
    expect((result.value as NotFoundException).message).toBe(
      'Receiver account not found',
    );
  });

  it('should return a Left if there are insufficient funds', async () => {
    const sender = Account.create({
      branch: '001',
      account: '1234567-8',
      ownerId: 'owner-id',
    });
    const receiver = Account.create({
      branch: '001',
      account: '8765432-1',
      ownerId: 'owner-id-2',
    });
    accountRepository.accounts.push(sender, receiver);

    const result = await service.execute(
      {
        receiverAccountId: receiver.id,
        value: 100,
        description: 'Test',
      },
      sender.id,
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(Error);
    expect((result.value as Error).message).toBe('Insufficient funds');
  });

  it('should create debit and credit transactions on success', async () => {
    const sender = Account.create({
      branch: '001',
      account: '1234567-8',
      ownerId: 'owner-id',
    });
    const receiver = Account.create({
      branch: '001',
      account: '8765432-1',
      ownerId: 'owner-id-2',
    });
    accountRepository.accounts.push(sender, receiver);

    transactionRepository.transactions.push(
      Transaction.create({
        value: 200,
        description: 'Initial credit',
        type: TransactionType.CREDIT,
        accountId: sender.id,
      }),
    );

    const result = await service.execute(
      {
        receiverAccountId: receiver.id,
        value: 100,
        description: 'Test transfer',
      },
      sender.id,
    );

    expect(result.isRight()).toBe(true);

    const senderTransactions = await transactionRepository.findByAccountId(
      sender.id,
    );
    const receiverTransactions = await transactionRepository.findByAccountId(
      receiver.id,
    );

    expect(senderTransactions).toHaveLength(2);
    expect(receiverTransactions).toHaveLength(1);

    const debit = senderTransactions.find(
      (t) => t.type === TransactionType.DEBIT,
    );
    const credit = receiverTransactions.find(
      (t) => t.type === TransactionType.CREDIT,
    );

    expect(debit).toBeDefined();
    expect(credit).toBeDefined();
    expect(debit?.value).toBe(100);
    expect(credit?.value).toBe(100);

    const senderBalance = await transactionRepository.getBalance(sender.id);
    const receiverBalance = await transactionRepository.getBalance(receiver.id);

    expect(senderBalance).toBe(100);
    expect(receiverBalance).toBe(100);
  });
});
