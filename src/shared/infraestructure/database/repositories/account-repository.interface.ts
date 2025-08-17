import { Account } from "src/modules/account/entities/account.entity";

export interface AccountRepositoryInterface {
  exists(branch: string, account: string): Promise<boolean>
  save(account: Account): Promise<void>
}