import { Transaction, TransactionType } from 'src/modules/account/entities/transaction.entity';

export interface FindAllOptions {
  itemsPerPage: number;
  currentPage: number;
  type?: TransactionType;
}

export interface FindAllResult {
  transactions: Transaction[];
  total: number;
}

export interface TransactionRepositoryInterface {
  save(transaction: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  findByAccountId(accountId: string): Promise<Transaction[]>;
  findAll(
    accountId: string,
    options: FindAllOptions,
  ): Promise<FindAllResult>;
  getBalance(accountId: string): Promise<number>;
  update(transaction: Transaction): Promise<void>;
}
