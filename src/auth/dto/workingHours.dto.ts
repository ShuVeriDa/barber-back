import { IsObject, IsOptional, IsString } from 'class-validator';

export class WorkingHoursDto {
  @IsString()
  @IsOptional()
  workingHours: 'atWork' | 'break' | 'dayOff';

  @IsOptional()
  @IsObject()
  breakTime: { start: Date; end: Date } | null;
}
