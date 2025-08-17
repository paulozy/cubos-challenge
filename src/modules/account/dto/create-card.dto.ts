import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length, MaxLength, MinLength } from 'class-validator';
import { CardType } from '../entities/card.entity';

export class CreateCardDto {
  @ApiProperty({ enum: CardType, example: CardType.PHYSICAL })
  @IsEnum(CardType)
  type: CardType;

  @ApiProperty({ example: '1234567890123456', required: false })
  @IsOptional()
  @IsString()
  @MinLength(13)
  @MaxLength(19)
  number?: string;

  @ApiProperty({ example: '123', required: false })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  cvv?: string;
}
