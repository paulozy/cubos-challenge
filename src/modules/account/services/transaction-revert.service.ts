import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Either, left, right } from '@shared/domain/either';
import { TransactionRepositoryInterface } from '@shared/infraestructure/database/repositories/transaction-repository.interface';
import { Transaction, TransactionType } from '../entities/transaction.entity';

type RevertTransactionResponse = Either<Error, Transaction>;

@Injectable()
export class TransactionRevertService {
  constructor(
    @Inject('TransactionRepositoryInterface')
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(
    transactionId: string,
    accountId: string,
  ): Promise<RevertTransactionResponse> {
    const transaction = await this.transactionRepository.findById(transactionId);

    if (!transaction || transaction.accountId !== accountId) {
      return left(new NotFoundException('Transaction not found'));
    }

    if (transaction.revertedById) {
      return left(new Error('Transaction already reverted'));
    }

    const balance = await this.transactionRepository.getBalance(accountId);

    if (transaction.type === TransactionType.CREDIT && balance < transaction.value) {
      return left(new Error('Insufficient funds to revert credit transaction'));
    }

    const revertTransaction = Transaction.create({
      value: transaction.value,
      description: `Revert of transaction ${transaction.id}`,
      type:
        transaction.type === TransactionType.CREDIT
          ? TransactionType.DEBIT
          : TransactionType.CREDIT,
      accountId,
    });

    transaction.revert(revertTransaction.id);

    await this.transactionRepository.save(revertTransaction);
    await this.transactionRepository.update(transaction);

    return right(revertTransaction);
  }
}
