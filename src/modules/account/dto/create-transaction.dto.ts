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
  @IsNumber()
  @Min(0.01)
  value: number;

  @IsString()
  @MinLength(1)
  description: string;

  @IsOptional()
  @IsUUID()
  cardId?: string;

  @IsEnum(TransactionType)
  type: TransactionType;
}
