import { IsObject, IsOptional } from 'class-validator';

export class BreakTimeDto {
  @IsOptional()
  @IsObject()
  breakTime: { start: Date; end: Date } | null;
}
