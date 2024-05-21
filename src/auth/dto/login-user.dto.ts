import {
  IsString,
  MinLength,
  IsEmail,
  MaxLength,
  Matches,
} from 'class-validator';

export class LoginUserDto {
  @MinLength(6)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsString()
  @IsEmail()
  email: string;
}
