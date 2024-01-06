import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}

export class SignUpDto {
  @IsEmail()
  readonly email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  readonly password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(64)
  readonly name: string;
}

export class SessionRefreshDto {
  @IsString()
  @MinLength(1)
  readonly refreshToken: string;
}
