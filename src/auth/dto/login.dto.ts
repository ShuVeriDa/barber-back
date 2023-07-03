import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(4, {
    message: 'Login cannot be less than 4 characters',
  })
  login: string;

  @IsString()
  @MinLength(6, {
    message: 'Password cannot be less than 6 characters',
  })
  password: string;
}
