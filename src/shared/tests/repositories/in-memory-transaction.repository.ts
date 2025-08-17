import { Transaction } from 'src/modules/account/entities/transaction.entity';
import {
  FindAllOptions,
  FindAllResult,
  TransactionRepositoryInterface,
} from '@shared/infraestructure/database/repositories/transaction-repository.interface';

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

  async findAll(
    accountId: string,
    options: FindAllOptions,
  ): Promise<FindAllResult> {
    const { itemsPerPage, currentPage, type } = options;

    let accountTransactions = this.transactions.filter(
      (transaction) => transaction.accountId === accountId,
    );

    if (type) {
      accountTransactions = accountTransactions.filter(
        (transaction) => transaction.type === type,
      );
    }

    const total = accountTransactions.length;

    accountTransactions.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return {
      transactions: accountTransactions.slice(start, end),
      total,
    };
  }

  async getBalance(accountId: string): Promise<number> {
    return this.transactions
      .filter((transaction) => transaction.accountId === accountId)
      .reduce((acc, transaction) => {
        if (transaction.type === 'credit') {
          return acc + transaction.value;
        }
        return acc - transaction.value;
      }, 0);
  }
}
