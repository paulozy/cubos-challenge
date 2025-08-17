import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';
import { Type } from 'class-transformer';

export class ListTransactionsDto {
  @ApiProperty({ example: 10, required: false })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  itemsPerPage?: number = 10;

  @ApiProperty({ example: 1, required: false })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  currentPage?: number = 1;

  @ApiProperty({ enum: TransactionType, example: TransactionType.DEBIT, required: false })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;
}
