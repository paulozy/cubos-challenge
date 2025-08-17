import { Inject, Injectable } from '@nestjs/common';
import { Either, right } from '@shared/domain/either';
import type { AccountRepositoryInterface } from '@shared/infraestructure/database/repositories/account-repository.interface';
import { Account } from '../entities/account.entity';

type ListAccountsResponse = Either<Error, Account[]>;

@Injectable()
export class AccountListService {
  constructor(
    @Inject('AccountRepositoryInterface')
    private readonly accountRepository: AccountRepositoryInterface,
  ) {}

  async execute(ownerId: string): Promise<ListAccountsResponse> {
    const accounts = await this.accountRepository.findByOwnerId(ownerId);
    return right(accounts);
  }
}
