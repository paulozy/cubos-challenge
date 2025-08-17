import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';
import { Type } from 'class-transformer';

export class ListTransactionsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  itemsPerPage?: number = 10;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  currentPage?: number = 1;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;
}
