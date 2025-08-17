import { AccountRepositoryInterface } from '@shared/infraestructure/database/repositories/account-repository.interface';
import { Account } from 'src/modules/account/entities/account.entity';

export class InMemoryAccountRepository implements AccountRepositoryInterface {
  public accounts: Account[] = [];

  async exists(branch: string, account: string): Promise<boolean> {
    return this.accounts.some(a => a.branch === branch && a.account === account);
  }

  async save(account: Account): Promise<void> {
    this.accounts.push(account);
  }
}