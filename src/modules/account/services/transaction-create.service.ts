import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Either, left, right } from '@shared/domain/either';
import { AccountRepositoryInterface } from '@shared/infraestructure/database/repositories/account-repository.interface';
import { TransactionRepositoryInterface } from '@shared/infraestructure/database/repositories/transaction-repository.interface';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction, TransactionType } from '../entities/transaction.entity';

type CreateTransactionResponse = Either<Error, Transaction>;

@Injectable()
export class TransactionCreateService {
  constructor(
    @Inject('TransactionRepositoryInterface')
    private readonly transactionRepository: TransactionRepositoryInterface,
    @Inject('AccountRepositoryInterface')
    private readonly accountRepository: AccountRepositoryInterface,
  ) {}

  async execute(
    payload: CreateTransactionDto,
    accountId: string,
  ): Promise<CreateTransactionResponse> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      return left(new NotFoundException('Account not found'));
    }

    if (payload.type === TransactionType.DEBIT) {
      const balance = await this.transactionRepository.getBalance(accountId);
      if (balance < payload.value) {
        return left(new Error('Insufficient funds'));
      }
    }

    const value =
      payload.type === TransactionType.DEBIT
        ? -payload.value
        : payload.value;

    const transaction = Transaction.create({
      ...payload,
      value,
      accountId,
    });

    await this.transactionRepository.save(transaction);

    return right(transaction);
  }
}
