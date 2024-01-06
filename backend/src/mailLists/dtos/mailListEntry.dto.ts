import { IsEmail } from 'class-validator';

export class CreateMailListEntryDto {
  @IsEmail()
  readonly email: string;
}
