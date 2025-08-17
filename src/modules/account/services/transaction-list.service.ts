import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Either, left, right } from '@shared/domain/either';
import { AccountRepositoryInterface } from '@shared/infraestructure/database/repositories/account-repository.interface';
import { TransactionRepositoryInterface } from '@shared/infraestructure/database/repositories/transaction-repository.interface';
import { ListTransactionsDto } from '../dto/list-transactions.dto';
import { Transaction } from '../entities/transaction.entity';

type PaginatedTransactions = {
  data: Transaction[];
  total: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
};

type TransactionListServiceResponse = Either<Error, PaginatedTransactions>;

@Injectable()
export class TransactionListService {
  constructor(
    @Inject('TransactionRepositoryInterface')
    private readonly transactionRepository: TransactionRepositoryInterface,
    @Inject('AccountRepositoryInterface')
    private readonly accountRepository: AccountRepositoryInterface,
  ) { }

  async execute(
    accountId: string,
    query: ListTransactionsDto,
  ): Promise<TransactionListServiceResponse> {
    const { currentPage = 1, itemsPerPage = 10, type } = query;

    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      return left(new NotFoundException('Account not found'));
    }

    const { transactions, total } = await this.transactionRepository.findAll(
      accountId,
      { currentPage, itemsPerPage, type },
    );

    const totalPages = Math.ceil(total / itemsPerPage);

    return right({
      data: transactions,
      total: +total,
      itemsPerPage: +itemsPerPage,
      currentPage: +currentPage,
      totalPages: +totalPages,
    });
  }
}
