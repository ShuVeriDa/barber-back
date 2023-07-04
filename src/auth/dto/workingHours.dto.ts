import { IsOptional, IsString } from 'class-validator';

export class WorkingHoursDto {
  @IsString()
  @IsOptional()
  workingHours: 'atWork' | 'break' | 'dayOff';
}
