import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @ApiProperty({ example: 100.5 })
  @IsNumber()
  @Min(0.01)
  value: number;

  @ApiProperty({ example: 'Payment for services' })
  @IsString()
  @MinLength(1)
  description: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', required: false })
  @IsOptional()
  @IsUUID()
  cardId?: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.DEBIT })
  @IsEnum(TransactionType)
  type: TransactionType;
}
