import { Transaction } from 'src/modules/account/entities/transaction.entity';
import { TransactionRepositoryInterface } from '@shared/infraestructure/database/repositories/transaction-repository.interface';

export class InMemoryTransactionRepository
  implements TransactionRepositoryInterface
{
  public transactions: Transaction[] = [];

  async save(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction);
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    return this.transactions.filter(
      (transaction) => transaction.accountId === accountId,
    );
  }

  async getBalance(accountId: string): Promise<number> {
    return this.transactions
      .filter((transaction) => transaction.accountId === accountId)
      .reduce((acc, transaction) => acc + transaction.value, 0);
  }
}
