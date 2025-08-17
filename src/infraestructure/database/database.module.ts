import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAccountRepository } from "./prisma/repositories/prisma-account.repository";
import { PrismaCardRepository } from "./prisma/repositories/prisma-card.repository";
import { PrismaPeopleRepository } from "./prisma/repositories/prisma-people.repository";
import { PrismaTransactionRepository } from "./prisma/repositories/prisma-transaction.repository";

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: 'CardRepositoryInterface',
      useClass: PrismaCardRepository,
    },
    {
      provide: 'TransactionRepositoryInterface',
      useClass: PrismaTransactionRepository,
    },
    {
      provide: 'AccountRepositoryInterface',
      useClass: PrismaAccountRepository,
    },
    {
      provide: 'PeopleRepositoryInterface',
      useClass: PrismaPeopleRepository,
    },
  ],
  exports: [
    'CardRepositoryInterface',
    'TransactionRepositoryInterface',
    'AccountRepositoryInterface',
    'PeopleRepositoryInterface'
  ],
})
export class DatabaseModule { }