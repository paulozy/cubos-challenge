import { IsString, Length, Matches } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @Length(3, 3, { message: 'Branch must be 3 characters long' })
  branch: string;

  @IsString()
  @Matches(/^\d{7}-\d{1}$/, {
    message: 'Account must be in the format ddddddd-d',
  })
  account: string;
}