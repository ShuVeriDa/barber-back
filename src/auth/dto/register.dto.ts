import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

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

  @IsString()
  @MinLength(3, {
    message: 'The minimum length of the firstName should be 3 characters',
  })
  firstName: string;

  @IsString()
  @MinLength(3, {
    message: 'The minimum length of the lastName should be 3 characters',
  })
  lastName: string;

  @IsString()
  avatar: string;

  @IsDateString()
  birthDate: Date;
}
