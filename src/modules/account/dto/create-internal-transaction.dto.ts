import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreateInternalTransactionDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsUUID()
  receiverAccountId: string;

  @ApiProperty({ example: 100.5 })
  @IsNumber()
  @Min(0.01)
  value: number;

  @ApiProperty({ example: 'Payment for services' })
  @IsString()
  @MinLength(1)
  description: string;
}
