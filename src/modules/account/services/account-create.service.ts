import { Inject, Injectable } from '@nestjs/common';
import { Either, left, right } from '@shared/domain/either';
import type { AccountRepositoryInterface } from '@shared/infraestructure/database/repositories/account-repository.interface';
import type { PeopleRepositoryInterface } from '@shared/infraestructure/database/repositories/people-repository.interface';
import { CreateAccountDto } from '../dto/create-account.dto';
import { Account } from '../entities/account.entity';

type CreateAccountResponse = Either<Error, Account>;

@Injectable()
export class AccountCreateService {
  constructor(
    @Inject('AccountRepositoryInterface')
    private readonly accountRepository: AccountRepositoryInterface,
    @Inject('PeopleRepositoryInterface')
    private readonly peopleRepository: PeopleRepositoryInterface,
  ) {}

  async execute(payload: CreateAccountDto, ownerId: string): Promise<CreateAccountResponse> {
    const { branch, account } = payload;

    const owner = await this.peopleRepository.findById(ownerId);
    if (!owner) {
      return left(new Error('Owner not found'));
    }

    const accountExists = await this.accountRepository.exists(branch, account);
    if (accountExists) {
      return left(new Error('Account already exists'));
    }

    const newAccount = Account.create({ branch, account, ownerId });

    await this.accountRepository.save(newAccount);
    return right(newAccount);
  }
}