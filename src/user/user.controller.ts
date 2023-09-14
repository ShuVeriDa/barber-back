import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { WorkingHoursDto } from './dto/workingHours.dto';
import { User } from '../auth/decorators/user.decorator';
import { BreakTimeDto } from './dto/breakTime.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  allUsers() {
    return this.userService.fetchAll();
  }

  @Get('status/:id')
  fetchStatus(@Param('id') userId: string) {
    return this.userService.fetchStatus(userId);
  }

  @Patch('status')
  @Auth('admin')
  changeWorkingHouse(@Body() dto: WorkingHoursDto, @User('id') userId: string) {
    return this.userService.changeWorkingHouse(dto, userId);
  }

  @Patch('breaktime')
  @Auth('admin')
  breakTime(@Body() dto: BreakTimeDto, @User('id') userId: string) {
    return this.userService.breakTime(dto, userId);
  }
}
