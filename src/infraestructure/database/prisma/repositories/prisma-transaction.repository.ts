import { Transaction, TransactionType } from '@modules/account/entities/transaction.entity';
import { Inject, Injectable } from '@nestjs/common';
import {
  Prisma,
  TransactionType as PrismaTransactionType,
} from '@prisma/client';
import {
  FindAllOptions,
  FindAllResult,
  TransactionRepositoryInterface,
} from '@shared/infraestructure/database/repositories/transaction-repository.interface';
import { PrismaTransactionMapper } from '../mappers/prisma-transaction.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaTransactionRepository
  implements TransactionRepositoryInterface {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService
  ) { }

  async save(transaction: Transaction): Promise<void> {
    const data = PrismaTransactionMapper.toPrisma(transaction);
    await this.prisma.transaction.create({ data });
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    return transaction ? PrismaTransactionMapper.toDomain(transaction) : null;
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: { accountId },
    });
    return transactions.map(PrismaTransactionMapper.toDomain);
  }

  async findAll(
    accountId: string,
    options: FindAllOptions,
  ): Promise<FindAllResult> {
    const { itemsPerPage, currentPage, type } = options;
    const where: Prisma.TransactionWhereInput = {
      accountId,
    };

    if (type) {
      where.type =
        type === TransactionType.CREDIT
          ? PrismaTransactionType.CREDIT
          : PrismaTransactionType.DEBIT;
    }

    const total = await this.prisma.transaction.count({ where });
    const transactions = await this.prisma.transaction.findMany({
      where,
      skip: (currentPage - 1) * itemsPerPage,
      take: +itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      transactions: transactions.map(PrismaTransactionMapper.toDomain),
      total,
    };
  }

  async getBalance(accountId: string): Promise<number> {
    const transactions = await this.prisma.transaction.findMany({
      where: { accountId },
    });

    return transactions.reduce((acc, transaction) => {
      if (transaction.type === 'CREDIT') {
        return acc + transaction.value;
      }
      return acc - transaction.value;
    }, 0);
  }

  async update(transaction: Transaction): Promise<void> {
    const data = PrismaTransactionMapper.toPrisma(transaction);
    await this.prisma.transaction.update({
      where: { id: transaction.id },
      data,
    });
  }
}