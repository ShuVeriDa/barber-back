import { IsBoolean, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(4, {
    message: 'Login cannot be less than 4 characters',
  })
  login: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsString()
  @MinLength(6, {
    message: 'Password cannot be less than 6 characters',
  })
  password: string;
}
