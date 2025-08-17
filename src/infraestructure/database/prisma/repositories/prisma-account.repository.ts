import { Account } from '@modules/account/entities/account.entity';
import { Inject, Injectable } from '@nestjs/common';
import { AccountRepositoryInterface } from '@shared/infraestructure/database/repositories/account-repository.interface';
import { PrismaAccountMapper } from '../mappers/prisma-account.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAccountRepository implements AccountRepositoryInterface {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService
  ) { }

  async exists(branch: string, account: string): Promise<boolean> {
    const acc = await this.prisma.account.findUnique({
      where: { account },
    });
    return !!acc;
  }

  async save(account: Account): Promise<void> {
    const data = PrismaAccountMapper.toPrisma(account);
    await this.prisma.account.create({ data });
  }

  async findByOwnerId(ownerId: string): Promise<Account[]> {
    const accounts = await this.prisma.account.findMany({
      where: { ownerId },
    });
    return accounts.map(PrismaAccountMapper.toDomain);
  }

  async findById(id: string): Promise<Account | undefined> {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });
    return account ? PrismaAccountMapper.toDomain(account) : undefined;
  }
}
