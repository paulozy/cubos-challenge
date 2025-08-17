import { IsNumber, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreateInternalTransactionDto {
  @IsUUID()
  receiverAccountId: string;

  @IsNumber()
  @Min(0.01)
  value: number;

  @IsString()
  @MinLength(1)
  description: string;
}
