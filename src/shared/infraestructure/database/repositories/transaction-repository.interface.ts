import { Transaction } from '@modules/account/entities/transaction.entity';

export interface TransactionRepositoryInterface {
  save(transaction: Transaction): Promise<void>;
  findByAccountId(accountId: string): Promise<Transaction[]>;
  getBalance(accountId: string): Promise<number>;
}
