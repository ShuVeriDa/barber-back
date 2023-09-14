import { IsArray, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  name: string;

  @IsNumber()
  phone: number;

  @IsArray()
  cards: string[];

  @IsNumber()
  price: number;

  @IsDateString()
  dateTime: Date;

  @IsString()
  barberId: string;
}
