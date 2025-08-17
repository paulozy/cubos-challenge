import { Account } from "@modules/account/entities/account.entity";

export interface AccountRepositoryInterface {
  exists(branch: string, account: string): Promise<boolean>
  save(account: Account): Promise<void>
  findByOwnerId(ownerId: string): Promise<Account[]>
  findById(id: string): Promise<Account | undefined>
}