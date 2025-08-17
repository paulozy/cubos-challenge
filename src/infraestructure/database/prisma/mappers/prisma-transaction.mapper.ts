import {
  Transaction,
  TransactionType,
} from '@modules/account/entities/transaction.entity';
import {
  Transaction as PrismaTransaction,
  TransactionType as PrismaTransactionType,
} from '@prisma/client';

export class PrismaTransactionMapper {
  static toDomain(raw: PrismaTransaction): Transaction {
    return Transaction.create({
      id: raw.id,
      value: raw.value,
      description: raw.description,
      type:
        raw.type === PrismaTransactionType.CREDIT
          ? TransactionType.CREDIT
          : TransactionType.DEBIT,
      cardId: raw.cardId ?? undefined,
      accountId: raw.accountId,
      revertedById: raw.revertedById ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPrisma(transaction: Transaction) {
    return {
      id: transaction.id,
      value: transaction.value,
      description: transaction.description,
      type:
        transaction.type === TransactionType.CREDIT
          ? PrismaTransactionType.CREDIT
          : PrismaTransactionType.DEBIT,
      cardId: transaction.cardId,
      accountId: transaction.accountId,
      revertedById: transaction.revertedById,
    };
  }
}
