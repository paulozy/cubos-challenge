import { Account } from '@modules/account/entities/account.entity';
import { Account as PrismaAccount } from '@prisma/client';

export class PrismaAccountMapper {
  static toDomain(raw: PrismaAccount): Account {
    return Account.create({
      id: raw.id,
      branch: raw.branch,
      account: raw.account,
      ownerId: raw.ownerId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPrisma(account: Account) {
    return {
      id: account.id,
      branch: account.branch,
      account: account.account,
      ownerId: account.ownerId,
    };
  }
}
