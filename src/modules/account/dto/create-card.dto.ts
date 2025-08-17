import { IsEnum, IsOptional, IsString, Length, MaxLength, MinLength } from 'class-validator';
import { CardType } from '../entities/card.entity';

export class CreateCardDto {
  @IsEnum(CardType)
  type: CardType;

  @IsOptional()
  @IsString()
  @MinLength(13)
  @MaxLength(19)
  number?: string;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  cvv?: string;
}
