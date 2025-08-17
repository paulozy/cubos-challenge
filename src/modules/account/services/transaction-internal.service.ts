import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Either, left, right } from '@shared/domain/either';
import { AccountRepositoryInterface } from '@shared/infraestructure/database/repositories/account-repository.interface';
import { TransactionRepositoryInterface } from '@shared/infraestructure/database/repositories/transaction-repository.interface';
import { CreateInternalTransactionDto } from '../dto/create-internal-transaction.dto';
import { Transaction, TransactionType } from '../entities/transaction.entity';

type InternalTransactionResponse = Either<Error, Transaction>;

@Injectable()
export class TransactionInternalService {
  constructor(
    @Inject('TransactionRepositoryInterface')
    private readonly transactionRepository: TransactionRepositoryInterface,
    @Inject('AccountRepositoryInterface')
    private readonly accountRepository: AccountRepositoryInterface,
  ) {}

  async execute(
    payload: CreateInternalTransactionDto,
    senderAccountId: string,
  ): Promise<InternalTransactionResponse> {
    const { receiverAccountId, value, description } = payload;

    if (senderAccountId === receiverAccountId) {
      return left(new Error('Sender and receiver accounts cannot be the same'));
    }

    const senderAccount = await this.accountRepository.findById(senderAccountId);
    if (!senderAccount) {
      return left(new NotFoundException('Sender account not found'));
    }

    const receiverAccount =
      await this.accountRepository.findById(receiverAccountId);
    if (!receiverAccount) {
      return left(new NotFoundException('Receiver account not found'));
    }

    const senderBalance =
      await this.transactionRepository.getBalance(senderAccountId);
    if (senderBalance < value) {
      return left(new Error('Insufficient funds'));
    }

    const debitTransaction = Transaction.create({
      value: -value,
      description,
      type: TransactionType.DEBIT,
      accountId: senderAccountId,
    });

    const creditTransaction = Transaction.create({
      value,
      description,
      type: TransactionType.CREDIT,
      accountId: receiverAccountId,
    });

    await this.transactionRepository.save(debitTransaction);
    await this.transactionRepository.save(creditTransaction);

    return right(debitTransaction);
  }
}
