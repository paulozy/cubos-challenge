import { Inject, Injectable } from '@nestjs/common';
import { Either, left, right } from '@shared/domain/either';
import type { AccountRepositoryInterface } from '@shared/infraestructure/database/repositories/account-repository.interface';
import type { TransactionRepositoryInterface } from '@shared/infraestructure/database/repositories/transaction-repository.interface';

type AccountBalanceResponse = Either<Error, { balance: number }>;

@Injectable()
export class AccountBalanceService {
  constructor(
    @Inject('AccountRepositoryInterface')
    private readonly accountRepository: AccountRepositoryInterface,
    @Inject('TransactionRepositoryInterface')
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(accountId: string): Promise<AccountBalanceResponse> {
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      return left(new Error('Account not found'));
    }

    const balance = await this.transactionRepository.getBalance(accountId);

    return right({ balance });
  }
}