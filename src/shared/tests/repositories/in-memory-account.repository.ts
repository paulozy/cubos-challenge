import { Account } from '@modules/account/entities/account.entity';
import { AccountRepositoryInterface } from '@shared/infraestructure/database/repositories/account-repository.interface';

export class InMemoryAccountRepository implements AccountRepositoryInterface {
  public accounts: Account[] = [];

  async exists(branch: string, account: string): Promise<boolean> {
    return this.accounts.some(a => a.branch === branch && a.account === account);
  }

  async save(account: Account): Promise<void> {
    this.accounts.push(account);
  }

  async findByOwnerId(ownerId: string): Promise<Account[]> {
    return this.accounts.filter(a => a.ownerId === ownerId);
  }

  async findById(id: string): Promise<Account | undefined> {
    return this.accounts.find(a => a.id === id);
  }
}